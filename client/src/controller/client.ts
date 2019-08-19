import { Channel } from "../interfaces/channel";
import { Message } from "../interfaces/message";
import { User } from "../interfaces/user";
import { UserStatus } from "../interfaces/userStatus";
import { Display } from "../view/display";
import { xhr } from "../xhr";
import { EventHandler } from "./events";

/**
 * Represents a client
 */
export class Client {
	public readonly host: string = window.document.location.host;
	public readonly url = {
		channelsList: "/api/channelsList.php",
		messagesList: "/api/messages.php",
		usersList: "/api/usersList.php",

		socket: {
			port: 8080,
			protocol: `ws${window.location.protocol === "https:" ? "s" : ""}`,
			url: window.document.location.host + `${window.document.location.host === "localhost" ? "" : "/ws"}`,
		},
	};

	public readonly display: Display = new Display(this);
	public readonly eventHandler: EventHandler;

	public currentChannelId: number | undefined = undefined;
	public currentUserId: number = 0;

	// @ts-ignore
	public socket: WebSocket;

	private channels: Channel[] = [];
	private users: User[] = [];

	/**
	 * Creates a new client
	 */
	constructor() {
		this.display.offline();

		try {
			this.socket = new WebSocket(`${this.url.socket.protocol}://${this.url.socket.url}${window.document.location.host === "localhost" ? ":" + this.url.socket.port : ""}`);
			this.socket.onerror = () => {
				alert("Disconected from server");
			};
		} catch (error) {
			console.error("Could not create socket");
		}

		this.eventHandler = new EventHandler(this);

		(async () => {
			/* GET channels */
			for (const channel of JSON.parse(await xhr("GET", window.location.host, this.url.channelsList)).data) {
				const c: Channel = new Channel(Number.parseInt(channel.channelId, 10), 0, [], channel.channelName, channel.channelTopic);
				this.channels.push(c);
				this.display.addChannel(c);
			}

			/* GET users */
			for (const user of JSON.parse(await xhr("GET", window.location.host, this.url.usersList)).data) {
				const u: User = new User(user.userIcon ? user.userIcon : "", Number.parseInt(user.userId, 10), user.userName, user.userStatus);
				this.users.push(u);
				this.display.addUser(u);
			}

			/* Auto join channel */
			if (this.channels.length > 0) {
				try {
					await this.joinChannel(Number.parseInt(localStorage.getItem("currentChannelId") || "", 10) || this.channels[0].getChannelId);
				} catch (err) {
					console.error(err);
				}
			}
		})();
	}

	/**
	 * Returns the channels
	 */
	public get getChannels(): Channel[] {
		return this.channels;
	}

	/**
	 * Returns the users
	 */
	public get getUsers(): User[] {
		return this.users;
	}

	/**
	 * Returns the current user
	 */
	public getCurrentUser(): User {
		if (this.currentUserId) {
			return this.users.find((user) => user.getUserId === this.currentUserId)!;
		}
		return new User("", 0, "", UserStatus.ONLINE);
	}

	/**
	 * Returns the current channel
	 */
	public getCurrentChannel(): Channel | undefined {
		if (this.currentChannelId || this.currentChannelId === 0) {
			return this.channels.find((channel) => channel.getChannelId === this.currentChannelId)!;
		}
		return undefined;
	}

	/**
	 * Joins a channel
	 * @param {number} channelId the channel id to join
	 */
	public async joinChannel(channelId: number): Promise<void> {
		if (this.currentChannelId === channelId) {
			return;
		}

		this.currentChannelId = channelId;

		try {
			window.localStorage.setItem("currentChannelId", channelId.toString());
		} catch (err) {
			console.warn("Could not save current channel in localstorage");
		}

		/* fetch messages from server if no messages (no fetch ever done before) */
		if (!this.getCurrentChannel()!.getChannelFetched) {
			this.getCurrentChannel()!.fetch();
			for (const message of JSON.parse(await xhr("GET", window.location.host, `${this.url.messagesList}?channelId=${channelId}`)).data) {
				this.getCurrentChannel()!.addMessage(new Message(Number.parseInt(message.messageAuthorId, 10), channelId, message.messageContent, Number.parseInt(message.messageId, 10), Number.parseInt(message.messageTimestamp, 10)));
			}
		}

		this.display.joinChannel(this.channels.find((channel) => channel.getChannelId === channelId)!);
	}

	/**
	 * Gets a name of the user with such id
	 * @param {number} userId the user id
	 */
	public getUserNameById(userId: number): string {
		const result: User | undefined = this.users.find((user) => user.getUserId === userId);
		return result ? result.getUserName : "Unknown user";
	}

	/**
	 * Gets a string that is the url of the icon of the user
	 * @param {number} userId the user id
	 */
	public getUserIconById(userId: number): string {
		const result: User | undefined = this.users.find((user) => user.getUserId === userId);
		return result ? (result.getUserIcon ? result.getUserIcon : "/resource/img/user.svg") : "/resource/img/user.svg";
	}
}
