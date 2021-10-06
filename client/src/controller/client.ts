import { Channel } from "../interfaces/Channel";
import { Message } from "../interfaces/Message";
import { User } from "../interfaces/User";
import { UserStatus } from "../interfaces/UserStatus";
import { Ping } from "../messages/ping";
import { Response } from "../messages/response";
import { Display } from "../view/display";
import { EventHandler } from "./events";

/**
 * Represents a client
 */
export class Client {
	public static version: string = new Date().toLocaleString();

	public static host: string = window.document.location.host;
	public static url = {
		channelsList: "/api/channelsList.php",
		messagesList: "/api/messages.php",
		usersList: "/api/usersList.php",

		socket: {
			port: 8080,
			protocol: `ws${window.location.protocol === "https:" ? "s" : ""}`,
			url: window.document.location.host + `${window.document.location.host === "localhost" ? "" : "/ws"}`,
		},
	};

	private display: Display = new Display(this);
	// @ts-ignore
	private eventHandler: EventHandler;

	private currentChannelId: number | undefined = undefined;
	private currentUserId: number = 0;

	// @ts-ignore
	private socket: WebSocket;

	private channels: Map<number, Channel> = new Map();
	private users: Map<number, User> = new Map();

	/**
	 * Creates a new client
	 */
	public constructor() {
		new Promise(() => {
			console.log(`%cDeescord`, "color: #7289DA; font-size: 60px; text-shadow: -2px 0 black, 0 2px black, 2px 0 black, 0 -2px black; ");
			console.log(`Compiled ${Client.version}`);
		})
		.then(() => this.display.offline())
		.then(() => {
			this.socket = new WebSocket(`${Client.url.socket.protocol}://${Client.url.socket.url}${window.document.location.host === "localhost" ? ":" + Client.url.socket.port : ""}`);
			this.socket.onerror = () => {
				alert("Disconected from server");
			};
		})
		.then((() => this.eventHandler = new EventHandler(this)).bind(this))
		.then(() => fetch(Client.url.channelsList))
		.then((response: globalThis.Response) => {
			if(!response.ok) {
				throw new Error("");
			}
			return response.json() as Promise<{channelId: string, channelName: string, channelTopic: string}[]>;
		})
		.then((channels) => {
			channels.forEach((channel) => {
				const c: Channel = new Channel(Number.parseInt(channel.channelId, 10), 0, [], channel.channelName, channel.channelTopic);
				this.channels.set(c.getId(), c);
				this.display.addChannel(c);
			});
		})
		.then(() => {
			if(this.channels.size > 0) {
				return this.joinChannel(Number.parseInt(localStorage.getItem("currentChannelId") || "", 10) || this.channels.values().next().value.getChannelId);
			}
			return;
		})
		.then(() => fetch(Client.url.usersList))
		.then((response: globalThis.Response) => {
			if(!response.ok) {
				throw new Error("");
			}
			return response.json() as Promise<{userIcon: string, userId: string, userName: string, userStatus: UserStatus}[]>;
		})
		.then((users) => users.forEach((user) => {
			const u: User = new User(user.userIcon ? user.userIcon : "", Number.parseInt(user.userId, 10), user.userName, user.userStatus);
			this.users.set(u.getId(), u);
			this.display.addUser(u);
		}))
		.then(() => {
			return setInterval((): void => {
				this.socket.send(JSON.stringify(new Ping()));
			}, 10000);
		}
		.catch((error) => console.error(error));
	}

	public getDisplay(): Display {
		return this.display;
	}

	public getEventHandler(): EventHandler {
		return this.eventHandler;
	}

	public getCurrentChannelId(): number | undefined {
		return this.currentChannelId;
	}

	public setCurrentChannelId(currentChannelId: number | undefined): void {
		this.currentChannelId = currentChannelId;
	}

	public getCurrentUserId(): number {
		return this.currentUserId;
	}

	public setCurrentUserId(currentUserId: number): void {
		this.currentUserId = currentUserId;
	}

	public getSocket(): WebSocket {
		return this.socket;
	}

	/**
	 * Returns the channels
	 */
	public getChannels(): Map<number, Channel> {
		return this.channels;
	}

	/**
	 * Returns the users
	 */
	public getUsers(): Map<number, User> {
		return this.users;
	}

	/**
	 * Returns the current user
	 */
	public getCurrentUser(): User {
		if(this.currentUserId) {
			return this.users.get(this.currentUserId)!;
		}
		return new User("", 0, "", UserStatus.ONLINE);
	}

	/**
	 * Returns the current channel
	 */
	public getCurrentChannel(): Channel | undefined {
		if(this.currentChannelId || this.currentChannelId === 0) {
			return this.channels.get(this.currentChannelId)!;
		}
		return undefined;
	}

	/**
	 * Joins a channel
	 * @param {number} channelId the channel id to join
	 */
	public async joinChannel(channelId: number): Promise<void> {

		return new Promise((resolve, reject) => {
			if(this.currentChannelId === channelId) {
				throw new Error("");
			}
		})
		.then(() => this.currentChannelId = channelId)
		.then(() => window.localStorage.setItem("currentChannelId", channelId.toString()))
		.then(() => {
			/* fetch messages from server if no messages (no fetch ever done before) */
			if(!this.getCurrentChannel()!.isFetched()) {
				return this.getCurrentChannel()!.fetch();
			}
			return;
		})
		.then(() => fetch(`${Client.url.messagesList}?channelId=${channelId}`))
		.then((response: globalThis.Response) => {
			if(!response.ok) {
				throw new Error("");
			}
			return response.json() as Promise<{messageAuthorId: string, messageContent: string, messageId: string, messageTimestamp: string}[]>;
		})
		.then((messages) => {
			messages.forEach((message) => {
				this.getCurrentChannel()!.addMessage(new Message(Number.parseInt(message.messageAuthorId, 10), channelId, message.messageContent, Number.parseInt(message.messageId, 10), Number.parseInt(message.messageTimestamp, 10)));
			})
		})
		.then(() => this.display.joinChannel(this.channels.get(channelId)!))
		.catch((error) => console.error(error));
	}

	/**
	 * Gets a name of the user with such id
	 * @param {number} userId the user id
	 */
	public getUserNameById(userId: number): string {
		const result: User | undefined = this.users.get(userId);
		return result ? result.getName() : "Unknown user";
	}

	/**
	 * Gets a string that is the url of the icon of the user
	 * @param {number} userId the user id
	 */
	public getUserIconById(userId: number): string {
		const result: User | undefined = this.users.get(userId);
		return result ? (result.getIconURL() ? result.getIconURL() : "/resource/img/user.svg") : "/resource/img/user.svg";
	}

}
