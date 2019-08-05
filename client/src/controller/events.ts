import { Channel } from "../interfaces/channel";
import { Message } from "../interfaces/message";
import { User } from "../interfaces/user";
import { UserStatus } from "../interfaces/userStatus";

import { ChannelCreated } from "../messages/channel/channelCreated";
import { ChannelDeleted } from "../messages/channel/channelDeleted";
import { ChannelRenamed } from "../messages/channel/channelRenamed";
import { ChannelTopic } from "../messages/channel/channelTopic";
import { MessageSent } from "../messages/message/messageSent";
import { UserIconChanged } from "../messages/user/userIconChanged";
import { UserNameChanged } from "../messages/user/userNameChanged";
import { UserStatusChanged } from "../messages/user/userStatusChanged";
import { WhoAmI } from "../messages/whoAmI";

import { Client } from "./client";

/**
 * Represents an event handler
 */
export class EventHandler {
	private client: Client;

	private readonly channelCreate: HTMLButtonElement = document.getElementById("channelCreate")! as HTMLButtonElement;
	private readonly channelDelete: HTMLButtonElement = document.getElementById("channelDelete")! as HTMLButtonElement;
	private readonly channelName: HTMLInputElement = document.getElementById("channelName")! as HTMLInputElement;
	private readonly channelTopic: HTMLInputElement = document.getElementById("channelTopic")! as HTMLInputElement;
	private readonly disconnect: HTMLButtonElement = document.getElementById("disconnect")! as HTMLButtonElement;
	private readonly messageInput: HTMLTextAreaElement = document.getElementById("messageInput")! as HTMLTextAreaElement;
	private readonly userIconChange: HTMLImageElement = document.getElementById("userIconChange")! as HTMLImageElement;
	private readonly userNameChange: HTMLInputElement = document.getElementById("userNameChange")! as HTMLInputElement;
	private readonly userStatusChange: HTMLButtonElement = document.getElementById("userStatusChange")! as HTMLButtonElement;

	/**
	 * Creates a new even handler
	 * @param {Client} client a reference to the client
	 */
	constructor(client: Client) {
		this.client = client;
		this.socketEvent();
		this.addListeners();
	}

	/**
	 * Manages the socket connection
	 */
	private socketEvent(): void {
		if (!this.client.socket.OPEN) {
			console.warn(`WebSocket not ready. Aborting.`);
		}

		this.client.socket.onopen = () => {
			console.log(`Connected to server`);
			this.client.display.online();
			this.socketSend(JSON.stringify(new WhoAmI()));
		};

		this.client.socket.onerror = (e: Event) => {
			this.client.display.offline();
			console.error(`Error with connexion`);
		};

		this.client.socket.onmessage = async (ev: MessageEvent) => {
			let response: any;
			try {
				response = JSON.parse(ev.data);
			} catch (e) {
				console.warn("Recieved a message but could not parse it");
				return;
			}
			switch (response.type) {
				case "WhoAmI":
					this.client.currentUserId = response.data.userId;
					this.socketSend(JSON.stringify(new UserStatusChanged(UserStatus.ONLINE)));
					this.client.display.updateUser(this.client.getCurrentUser());
					break;

				case "ChannelTopic":
					this.client.getChannels
					.filter((channel: Channel) => channel.getChannelId === response.data.channelId)
					.forEach((channel: Channel) => {
						channel.setChannelTopic = response.data.channelTopic;
					});

					this.client.display.updateChannel(this.client.getChannels.find((channel: Channel) => channel.getChannelId === response.data.channelId)!);
					break;

				case "ChannelRenamed":
					this.client.getChannels
					.filter((channel) => channel.getChannelId === response.data.channelId)
					.forEach((channel) => {
						channel.setChannelName = response.data.channelName;
					});

					this.client.getChannels
						.filter((channel) => channel.getChannelId === response.data.channelId)
						.forEach((channel) => {
							this.client.display.updateChannel(channel);
						});
					break;

				case "ChannelDeleted":
					this.client.getChannels
					.filter((channel) => channel.getChannelId === response.data.channelId)
					.forEach((channel) => {
						this.client.getChannels.splice(this.client.getChannels.indexOf(channel), 1);
					});

					this.client.display.removeChannel(response.data.channelId);

					if (response.data.channelId === this.client.currentChannelId) {
						this.client.display.unjoinChannel();
						if (this.client.getChannels.length > 0) {
							await this.client.joinChannel(this.client.getChannels[0].getChannelId);
						} else {
							this.client.currentChannelId = undefined;
						}
					}
					break;

				case "ChannelCreated":
					const channel: Channel = new Channel(response.data.channelId, 0, [], response.data.channelName, response.data.channelTopic);
					this.client.getChannels.push(channel);
					this.client.display.addChannel(channel);
					if (this.client.getChannels.length === 1) {
						this.client.joinChannel(response.data.channelId);
					}
					break;

				case "MessageSent":
					const message: Message = new Message(response.data.messageAuthorId, response.data.messageChannelId, response.data.messageContent, response.data.messageId, response.data.messageTimestamp);
					if (this.client.getChannels.find((channel) => channel.getChannelId === response.data.messageChannelId)!.getChannelFetched) {
						this.client.getChannels
							.filter((channel) => channel.getChannelId === response.data.messageChannelId)
							.forEach((channel) => {
								channel.addMessage(message);
							});
					}
					if (response.data.messageChannelId === this.client.currentChannelId) {
						this.client.display.addMessage(message);
					} else if (this.client.getCurrentUser().getUserStatus !== UserStatus.DND) {
						new Audio("/resource/mp3/notification.mp3").play();
					}
					break;

				case "MessageEdited":
					break;

				case "MessageDeleted":
					break;

				case "UserStatusChanged":
					this.client.getUsers
						.filter((user) => user.getUserId === response.data.userId)
						.forEach((user) => {
							user.setUserStatus = response.data.userStatus;
							this.client.display.updateUser(user);
						});
					break;

				case "UserRegistered":
					const user: User = new User(response.data.userIcon, response.data.userId, response.data.userName, response.data.userStatus);
					this.client.getUsers.push(user);
					this.client.display.addUser(user);
					break;

				case "UserNameChanged":
					this.client.getUsers
						.filter((user) => user.getUserId === response.data.userId)
						.forEach((user) => {
							user.setUserName = response.data.userName;
							this.client.display.updateUser(user);
						});
					if (this.client.getCurrentChannel()) {
						this.client
							.getCurrentChannel()!
							.getChannelMessages.filter((message) => message.getMessageAuthorId === response.data.getUserId)
							.forEach((message) => {
								this.client.display.updateMessage(message);
							});
					}
					if (this.client.getCurrentUser().getUserId === response.data.userId) {
						this.userNameChange.value = response.data.userName;
					}
					break;

				case "UserIconChanged":
					this.client.getUsers
						.filter((user: User) => user.getUserId === response.data.userId)
						.forEach((user: User) => {
							user.setUserIcon = response.data.userIcon;
							this.client.display.updateUser(user);
						});
					if (this.client.getCurrentChannel()) {
						this.client
							.getCurrentChannel()!
							.getChannelMessages.filter((message: Message) => message.getMessageAuthorId === response.data.userId)
							.forEach((message: Message) => {
								this.client.display.updateMessage(message);
							});
					}
					break;

				case "Error":
					break;
				default:
			}
		};
	}

	/**
	 * Manages the listeners in the document
	 */
	private addListeners(): void {
		let idleTimeout: number;
		let previousStatus: UserStatus = UserStatus.ONLINE;

		/* User goes offline when leaves */
		window.addEventListener("beforeunload", (): void => {
			this.socketSend(JSON.stringify(new UserStatusChanged(UserStatus.OFFLINE)));
		});

		/* User goes idle automatically */
		window.addEventListener("blur", (): void => {
			idleTimeout = window.setTimeout(() => {
				if (this.client.getCurrentUser().getUserStatus === UserStatus.ONLINE) {
					previousStatus = this.client.getCurrentUser().getUserStatus;
					this.socketSend(JSON.stringify(new UserStatusChanged(UserStatus.IDLE)));
				}
			}, 10 * 1000);
		});

		/* User goes back online */
		window.addEventListener("focus", (): void => {
			window.clearTimeout(idleTimeout);
			if (this.client.getCurrentUser().getUserStatus === UserStatus.IDLE) {
				this.socketSend(JSON.stringify(new UserStatusChanged(previousStatus)));
			}
		});

		/* Create channel */
		this.channelCreate.addEventListener("click", () => {
			const newChannelName: string | null = prompt("Nom du nouveau channel");
			if (newChannelName || newChannelName ===  "") {
				const newChannelDescription: string = prompt("Topic du nouveau channel") || "";
				this.socketSend(JSON.stringify(new ChannelCreated(newChannelName, newChannelDescription)));
			}
		});

		/* Changer icon */
		this.userIconChange.addEventListener("click", (): void => {
			const userIconURL: string = prompt("URL de l'icone de profil") || "";
			if (userIconURL && userIconURL !== this.client.getCurrentUser().getUserIcon) {
				this.socketSend(JSON.stringify(new UserIconChanged(userIconURL)));
			}
		});

		/* Change Username */
		this.userNameChange.addEventListener("blur", (): void => {
			const userName: string = this.userNameChange.value || this.client.getCurrentUser().getUserName;
			if (this.client.getCurrentUser().getUserName !== userName) {
				this.socketSend(JSON.stringify(new UserNameChanged(userName)));
			} else if (this.userNameChange.value === "") {
				this.userNameChange.value = userName;
			}
		});

		/* Change user status */
		this.userStatusChange.addEventListener("click", (): void => {
			// @ts-ignore
			this.socketSend(JSON.stringify(new UserStatusChanged(UserStatus[Object.keys(UserStatus)[(Object.keys(UserStatus).map((s) => UserStatus[s]).indexOf(this.client.getCurrentUser().getUserStatus.toString()) + 1) % (Object.keys(UserStatus).length)]])));
		});

		/* Disconnect */
		this.disconnect.addEventListener("click", () => {
			this.socketSend(JSON.stringify(new UserStatusChanged(UserStatus.OFFLINE)));
			window.location.href = "/logout.php";
		});

		this.channelName.addEventListener("blur", () => {
			if (this.client.currentChannelId && this.client.getCurrentChannel()!.getChannelName !== this.channelName.value) {
				// client.getCurrentChannel()!.setChannelName = channelNameBox.value;
				this.socketSend(JSON.stringify(new ChannelRenamed(this.client.currentChannelId, this.channelName.value)));
			}
		});

		this.channelTopic.addEventListener("blur", () => {
			if (this.client.currentChannelId && this.client.getCurrentChannel()!.getChannelTopic !== this.channelTopic.value) {
				this.socketSend(JSON.stringify(new ChannelTopic(this.client.currentChannelId, this.channelTopic.value)));
			}
		});

		this.channelDelete.addEventListener("click", () => {
			if (this.client.currentChannelId) {
				this.socketSend(JSON.stringify(new ChannelDeleted(this.client.currentChannelId!)));
			}
		});

		this.messageInput.addEventListener("keypress", (ev: KeyboardEvent): void => {
			if (ev.key === "Enter" && !ev.shiftKey && this.client.currentChannelId && this.messageInput.value.trim() !== "") {
				this.socketSend(JSON.stringify(new MessageSent(this.client.currentUserId, this.client.currentChannelId, this.messageInput.value.trim())));
				setTimeout(() => {
					this.messageInput.value = "";
				}, 20);
			}
		});
	}

	private socketSend(message: string): void {
		try {
			if (this.client.socket.OPEN) {
				this.client.socket.send(message);
			} else {
				this.client.display.offline();
			}
		} catch (e) {
			this.client.display.offline();
		}
	}
}
