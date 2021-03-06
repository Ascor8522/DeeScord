import * as sqlite3 from "sqlite3";
import * as WebSocket from "ws";
import * as db from "./database";
import { UserStatus } from "./interfaces/userStatus";
import { Ping } from "./messages/ping";
import { WhoAmI } from "./messages/whoAmI";

let wss: WebSocket.Server;

const database: sqlite3.Database = new sqlite3.Database("./../../database.sqlite3", (err: Error | null): void => {

	if (err) {
		process.stderr.write("Error with database");
		process.exit(-1);
	}

	wss = new WebSocket.Server({
		port: 8080,
	}, async (): Promise<void> => {

		console.log(`${new Date().toLocaleString()} Server online`);

		type connectedUser = {
			userId: number,
			lastSeen: number,
		};

		let onlineUsers: connectedUser[] = [];
		const timeout: number = 30000;

		setInterval((): void => {
			const offlineUsers: connectedUser[] = [];
			const stillConneted: connectedUser[] = [];

			onlineUsers.forEach((user: connectedUser) => {
				if (Date.now() - user.lastSeen > timeout) {
					offlineUsers.push(user);
				} else {
					stillConneted.push(user);
				}
			});

			onlineUsers = stillConneted;
			offlineUsers.forEach(async (user: connectedUser): Promise<void> => {
				broadcast(wss, await db.changeUserStatus(database, user.userId, UserStatus.OFFLINE));
			});

		}, timeout);

		wss.on("connection", (connection) => {

			console.log(`${new Date().toLocaleString()} New user connected`);

			connection.on("message", async (data: string) => {
				let message;
				try {
					message = JSON.parse(data);
				} catch (e) {
					return;
				}

				if (!await db.isValidToken(database, message.token || "")) {
					return;
				}

				const userId: number = await db.getUserIdWithToken(database, message.token);
				if (onlineUsers.some((user: connectedUser): boolean => user.userId === userId)) {
					onlineUsers.push({userId, lastSeen: Date.now()});
				}

				switch (message.type || "") {
					case "Ping":
						connection.send(JSON.stringify(new Ping(Math.abs(Date.now() - message.data.timestamp))));
						break;

					case "WhoAmI":
						connection.send(JSON.stringify(new WhoAmI(userId)));
						break;

					case "ChannelCreated":
						broadcast(wss, await db.createNewChannel(database, await db.getNewChannelId(database), message.data.channelName, message.data.channelTopic, Date.now()));
						break;

					case "ChannelDeleted":
						broadcast(wss, await db.deleteChannel(database, message.data.channelId));
						break;

					case "ChannelRenamed":
						broadcast(wss, await db.changeChannelName(database, message.data.channelId, message.data.channelName));
						break;

					case "ChannelTopic":
						broadcast(wss, await db.changeChannelTopic(database, message.data.channelId, message.data.channelTopic));
						break;

					case "MessageDeleted":
						// TODO
						// broadcast(wss, await db.deleteMessage(database));
						break;

					case "MessageEdited":
						// TODO
						break;

					case "MessageSent":
						broadcast(wss, await db.createMessage(database, await db.getNewMessageId(database), message.data.messageChannelId, message.data.messageAuthorId, Date.now(), message.data.messageContent));
						break;

					case "UserIconChanged":
						broadcast(wss, await db.changeUserIcon(database, userId, message.data.userIcon));
						break;

					case "UserNameChanged":
						broadcast(wss, await db.userNameChange(database, userId, message.data.userName));
						break;

					case "UserStatusChanged":
						broadcast(wss, await db.changeUserStatus(database, userId, message.data.userStatus));
						break;
				}

			});

			connection.on("close", async () => {
				console.log(`${new Date().toLocaleString()} a client disconnected`);
			});
		});
	});

});

function broadcast(ws: WebSocket.Server, data: object) {
	ws.clients.forEach((client) => {
		if (client.readyState === WebSocket.OPEN) {
			client.send(JSON.stringify(data));
		}
	});
}
