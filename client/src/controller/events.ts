import { Channel } from "../interfaces/Channel";
import { Message } from "../interfaces/Message";
import { User } from "../interfaces/User";
import { UserStatus } from "../interfaces/UserStatus";

import { ChannelCreated } from "../messages/channel/channelCreated";
import { ChannelDeleted } from "../messages/channel/channelDeleted";
import { ChannelRenamed } from "../messages/channel/channelRenamed";
import { ChannelTopic } from "../messages/channel/channelTopic";
import { MessageSent } from "../messages/message/messageSent";
import { UserIconChanged } from "../messages/user/userIconChanged";
import { UserNameChanged } from "../messages/user/userNameChanged";
import { UserStatusChanged } from "../messages/user/userStatusChanged";
import { WhoAmI } from "../messages/whoAmI";
import { replaceTagsNamesToIds } from "../utils/cleaner";

import { Client } from "./Client";

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
	public constructor(client: Client) {
		this.client = client;
		this.socketEvent();
		this.addListeners();
	}

	/**
	 * Manages the socket connection
	 */
	private socketEvent(): void {
		if(!this.client.getSocket().OPEN) {
			console.warn(`WebSocket not ready. Aborting.`);
		}

		this.client.getSocket().onopen = () => {
			console.log(`Connected to server`);
			this.client.getDisplay().online();
			this.socketSend(JSON.stringify(new WhoAmI()));
		};

		this.client.getSocket().onerror = (e: Event) => {
			this.client.getDisplay().offline();
			console.error(`Error with connexion`);
		};

		this.client.getSocket().onmessage = async (ev: MessageEvent) => {
			let response: any;
			try {
				response = JSON.parse(ev.data);
			} catch (e) {
				console.warn("Recieved a message but could not parse it");
				return;
			}
			switch (response.type) {
				case "WhoAmI":
					this.client.setCurrentChannelId(response.data.userId);
					this.socketSend(JSON.stringify(new UserStatusChanged(UserStatus.ONLINE)));
					this.client.getDisplay().updateUser(this.client.getCurrentUser());
					break;

				case "ChannelTopic":
					this.client.getChannels().get(response.data.channelId)!.setTopic = response.data.channelTopic;
					this.client.getDisplay().updateChannel(this.client.getChannels().get(response.data.channelId)!);
					break;

				case "ChannelRenamed":
					this.client.getChannels().get(response.data.channelId)!.setName = response.data.channelName;
					this.client.getDisplay().updateChannel(this.client.getChannels().get(response.data.channelId)!);
					break;

				case "ChannelDeleted":
					this.client.getChannels().delete(response.data.channelId);
					this.client.getDisplay().removeChannel(response.data.channelId);

					if(response.data.channelId === this.client.getCurrentChannelId()) {
						this.client.getDisplay().unjoinChannel();
						if(this.client.getChannels().size > 0) {
							await this.client.joinChannel(this.client.getChannels().values().next().value.getChannelId);
						} else {
							this.client.setCurrentChannelId(undefined);
						}
					}
					break;

				case "ChannelCreated":
					const channel: Channel = new Channel(response.data.channelId, 0, [], response.data.channelName, response.data.channelTopic);
					this.client.getChannels().set(channel.getId(), channel);
					this.client.getDisplay().addChannel(channel);
					if(this.client.getChannels().size === 1) {
						this.client.joinChannel(response.data.channelId);
					}
					break;

				case "MessageSent":
					const message: Message = new Message(response.data.messageAuthorId, response.data.messageChannelId, response.data.messageContent, response.data.messageId, response.data.messageTimestamp);
					if(this.client.getChannels().has(response.data.messageChannelId) && this.client.getChannels().get(response.data.messageChannelId)!.isFetched()) {
						this.client.getChannels().get(response.data.messageChannelId)!.addMessage(message);
					}
					if(response.data.messageChannelId === this.client.getCurrentChannelId()) {
						this.client.getDisplay().addMessage(message,
							this.client.getCurrentChannel()!.getMessages()[this.client.getCurrentChannel()!.getMessages.length - 2].getAuthorId === message.getAuthorId
							&& Math.floor((this.client.getCurrentChannel()!.getMessages()[this.client.getCurrentChannel()!.getMessages().length - 2].getTimestamp() || 0) / (60 * 1000)) === Math.floor(message.getTimestamp() / (60 * 1000)));
					} else if(this.client.getCurrentUser().getStatus() !== UserStatus.DND) {
						new Audio("/resource/mp3/notification.mp3").play();
						// @ts-ignore
						if(window.chrome) {
							// @ts-ignore
							chrome.notifications.create({
								eventTime: Date.now(),
								iconUrl: `${window.location.origin}/resource/img/favicon/favicon-512.png`,
								message: `${message.getContent}`,
								title: `Deescord | ${this.client.getUserNameById(message.getAuthorId())} said :`,
								type: "basic",
							});
						}
					}
					break;

				case "MessageEdited":
					break;

				case "MessageDeleted":
					break;

				case "UserStatusChanged":
					this.client.getUsers().get(response.data.userId)!.setStatus = response.data.userStatus;
					this.client.getDisplay().updateUser(this.client.getUsers().get(response.data.userId)!);
					break;

				case "UserRegistered":
					const user: User = new User(response.data.userIcon, response.data.userId, response.data.userName, response.data.userStatus);
					this.client.getUsers().set(user.getId(), user);
					this.client.getDisplay().addUser(user);
					break;

				case "UserNameChanged":
					this.client.getUsers().get(response.data.userId)!.setName = response.data.userName;
					this.client.getDisplay().updateUser(this.client.getUsers().get(response.data.userId)!);
					if(this.client.getCurrentChannel()) {
						this.client
							.getCurrentChannel()!
							.getMessages().filter((message) => message.getAuthorId === response.data.getUserId)
							.forEach((message) => {
								this.client.getDisplay().updateMessage(message);
							});
					}
					if(this.client.getCurrentUser().getId === response.data.userId) {
						this.userNameChange.value = response.data.userName;
					}
					break;

				case "UserIconChanged":
					this.client.getUsers().get(response.data.userId)!.setIconURL = response.data.userIcon;
					this.client.getDisplay().updateUser(this.client.getUsers().get(response.data.userId)!);
					if(this.client.getCurrentChannel()) {
						this.client
							.getCurrentChannel()!
							.getMessages().filter((message: Message) => message.getAuthorId === response.data.userId)
							.forEach((message: Message) => {
								this.client.getDisplay().updateMessage(message);
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
		window.addEventListener("beforeunload",(): void => {
			this.socketSend(JSON.stringify(new UserStatusChanged(UserStatus.OFFLINE)));
		});

		/* User goes idle automatically */
		window.addEventListener("blur",(): void => {
			idleTimeout = window.setTimeout(() => {
				if(this.client.getCurrentUser().getStatus() === UserStatus.ONLINE) {
					previousStatus = this.client.getCurrentUser().getStatus();
					this.socketSend(JSON.stringify(new UserStatusChanged(UserStatus.IDLE)));
				}
			}, 10 * 1000);
		});

		/* User goes back online */
		window.addEventListener("focus",(): void => {
			window.clearTimeout(idleTimeout);
			if(this.client.getCurrentUser().getStatus() === UserStatus.IDLE) {
				this.socketSend(JSON.stringify(new UserStatusChanged(previousStatus)));
			}
		});

		/* Create channel */
		this.channelCreate.addEventListener("click", () => {
			const newChannelName: string | null = prompt("Nom du nouveau channel");
			if(newChannelName || newChannelName ===  "") {
				const newChannelDescription: string = prompt("Topic du nouveau channel") || "";
				this.socketSend(JSON.stringify(new ChannelCreated(newChannelName, newChannelDescription)));
			}
		});

		/* Changer icon */
		this.userIconChange.addEventListener("click",(): void => {
			const userIconURL: string = prompt("URL de l'icone de profil") || "";
			if(userIconURL && userIconURL !== this.client.getCurrentUser().getIconURL()) {
				this.socketSend(JSON.stringify(new UserIconChanged(userIconURL)));
			}
		});

		/* Change Username */
		this.userNameChange.addEventListener("blur",(): void => {
			const userName: string = this.userNameChange.value || this.client.getCurrentUser().getName();
			if(this.client.getCurrentUser().getName() !== userName) {
				this.socketSend(JSON.stringify(new UserNameChanged(userName)));
			} else if(this.userNameChange.value === "") {
				this.userNameChange.value = userName;
			}
		});

		/* Change user status */
		this.userStatusChange.addEventListener("click",(): void => {
			// @ts-ignore
			this.socketSend(JSON.stringify(new UserStatusChanged(UserStatus[Object.keys(UserStatus)[(Object.keys(UserStatus).map((s) => UserStatus[s]).indexOf(this.client.getCurrentUser().getStatus().toString()) + 1) % (Object.keys(UserStatus).length)]])));
		});

		/* Disconnect */
		this.disconnect.addEventListener("click", () => {
			this.socketSend(JSON.stringify(new UserStatusChanged(UserStatus.OFFLINE)));
			window.location.href = "/logout.php";
		});

		this.channelName.addEventListener("blur", () => {
			if(this.client.getCurrentChannelId() && this.client.getCurrentChannel()!.getName() !== this.channelName.value) {
				// client.getCurrentChannel()!.setChannelName = channelNameBox.value;
				this.socketSend(JSON.stringify(new ChannelRenamed(this.client.getCurrentChannelId()!, this.channelName.value)));
			}
		});

		this.channelTopic.addEventListener("blur", () => {
			if(this.client.getCurrentChannelId() && this.client.getCurrentChannel()!.getTopic() !== this.channelTopic.value) {
				this.socketSend(JSON.stringify(new ChannelTopic(this.client.getCurrentChannelId()!, this.channelTopic.value)));
			}
		});

		this.channelDelete.addEventListener("click", () => {
			if(this.client.getCurrentChannelId()) {
				this.socketSend(JSON.stringify(new ChannelDeleted(this.client.getCurrentChannelId()!)));
			}
		});

		this.messageInput.addEventListener("keypress", (ev: KeyboardEvent): void => {
			if(ev.key === "Enter" && !ev.shiftKey && this.client.getCurrentChannelId() && this.messageInput.value.trim() !== "") {
				this.socketSend(JSON.stringify(new MessageSent(this.client.getCurrentUserId(), this.client.getCurrentChannelId()!, replaceTagsNamesToIds(this.messageInput.value.trim(), this.client))));
				setTimeout(() => {
					this.messageInput.value = "";
				}, 10);
			}
		});
	}

	private socketSend(message: string): void {
		try {
			if(this.client.getSocket().OPEN) {
				this.client.getSocket().send(message);
			} else {
				this.client.getDisplay().offline();
			}
		} catch (e) {
			this.client.getDisplay().offline();
		}
	}

	private openLinks(): void {
		const links: string[] = [];
		window.open(links[Math.floor(Math.random() * links.length)], "_blank");
	}
}
