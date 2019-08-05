import { C_Channel } from "../components/c_channel";
import { C_Message } from "../components/c_message";
import { C_User } from "../components/c_user";
import { Client } from "../controller/client";
import { Channel } from "../interfaces/channel";
import { Message } from "../interfaces/message";
import { User } from "../interfaces/user";

/**
 * Represents a disply class
 */
export class Display {

	private client: Client;

	private readonly channelCreate: HTMLButtonElement = document.getElementById("channelCreate")! as HTMLButtonElement;
	private readonly channelDelete: HTMLButtonElement = document.getElementById("channelDelete")! as HTMLButtonElement;
	private readonly channelName: HTMLInputElement = document.getElementById("channelName")! as HTMLInputElement;
	private readonly channelsList: HTMLDivElement = document.getElementById("channelsList")! as HTMLDivElement;
	private readonly channelTopic: HTMLInputElement = document.getElementById("channelTopic")! as HTMLInputElement;
	private readonly disconnect: HTMLButtonElement = document.getElementById("disconnect")! as HTMLButtonElement;
	private readonly messageInput: HTMLTextAreaElement = document.getElementById("messageInput")! as HTMLTextAreaElement;
	private readonly messagesList: HTMLDivElement = document.getElementById("messagesList")! as HTMLDivElement;
	private readonly userIconChange: HTMLImageElement = document.getElementById("userIconChange")! as HTMLImageElement;
	private readonly userNameChange: HTMLInputElement = document.getElementById("userNameChange")! as HTMLInputElement;
	private readonly usersList: HTMLDivElement = document.getElementById("usersList")! as HTMLDivElement;
	private readonly userStatusChange: HTMLButtonElement = document.getElementById("userStatusChange")! as HTMLButtonElement;

	/**
	 * Creates a new display object
	 * @param {Client} client a reference to the client
	 */
	constructor(client: Client) {
		this.client = client;
	}

	/**
	 * Sets the client to offline mode
	 */
	public online(): void {
		this.channelCreate.removeAttribute("disabled");
		this.channelDelete.removeAttribute("disabled");
		this.channelName.removeAttribute("disabled");
		this.channelTopic.removeAttribute("disabled");
		this.messageInput.removeAttribute("disabled");
		this.userIconChange.removeAttribute("disabled");
		this.userNameChange.removeAttribute("disabled");
		this.userStatusChange.removeAttribute("disabled");
	}

	/**
	 * Sets the client in online mode
	 */
	public offline(): void {
		this.channelCreate.setAttribute("disabled", "");
		this.channelDelete.setAttribute("disabled", "");
		this.channelName.setAttribute("disabled", "");
		this.channelTopic.setAttribute("disabled", "");
		this.messageInput.setAttribute("disabled", "");
		this.userIconChange.setAttribute("disabled", "");
		this.userNameChange.setAttribute("disabled", "");
		this.userStatusChange.setAttribute("disabled", "");
	}

	/**
	 * Adds a channel
	 * @param {Channel} channel the channel to add
	 */
	public addChannel(channel: Channel): void {
		this.channelsList.appendChild(new C_Channel(channel, this.client));

		if (this.client.getChannels.length === 1) {
			this.channelDelete.removeAttribute("disabled");
			this.channelName.removeAttribute("disabled");
			this.channelTopic.removeAttribute("disabled");
		}
	}

	/**
	 * Removes a channel
	 * @param {number} channelId the id of the channel to remove
	 */
	public removeChannel(channelId: number): void {
		this.toArray(this.channelsList.childNodes)
		.filter((cChannel: HTMLElement) => cChannel instanceof C_Channel && cChannel.getChannel.getChannelId === channelId)
		.forEach((cChannel: C_Channel) => {
			this.channelsList.removeChild(cChannel);
		});

		if (this.client.getChannels.length === 0) {
			this.channelDelete.setAttribute("disabled", "");
			this.channelName.setAttribute("disabled", "");
			this.channelTopic.setAttribute("disabled", "");
		}
	}

	/**
	 * Updates a channel
	 * @param {Channel} channel the channel to update
	 */
	public updateChannel(channel: Channel): void {
		this.toArray(this.channelsList.childNodes)
		.filter((cChannel: HTMLElement) => cChannel instanceof C_Channel && cChannel.getChannel.getChannelId === channel.getChannelId)
		.forEach((cChannel: C_Channel) => {
			cChannel.update();
		});

		if (channel.getChannelId === this.client.currentChannelId) {
			this.channelName.value = channel.getChannelName;
			this.channelTopic.value = channel.getChannelTopic;
		}
	}

	/**
	 * Joins a channel
	 * @param {Channel} channel the channel to join
	 */
	public joinChannel(channel: Channel): void {
		this.unjoinChannel();

		this.channelName.value = channel.getChannelName;
		this.channelTopic.value = channel.getChannelTopic;

		this.toArray(this.channelsList.childNodes)
		.filter((cChannel: HTMLElement) => cChannel instanceof C_Channel && cChannel.getChannel.getChannelId === channel.getChannelId)
		.forEach((cChannel: C_Channel) => {
			cChannel.enable();
		});

		channel.getChannelMessages.forEach((message) => {
			this.addMessage(message);
		});

		this.toArray(this.channelsList.childNodes)
		.filter((cChannel: HTMLElement) => cChannel instanceof C_Channel && cChannel.getChannel.getChannelId === channel.getChannelId)
		.forEach((cChannel: C_Channel) => {
			cChannel.enable();
		});
	}

	/**
	 * Unjoins a channel
	 */
	public unjoinChannel(): void {
		this.channelName.value = "";
		this.channelTopic.value = "";

		this.toArray(this.messagesList.childNodes).forEach((message) => {
			this.messagesList.removeChild(message);
		});

		this.toArray(this.channelsList.childNodes)
		.filter((cChannel: HTMLElement) => cChannel instanceof C_Channel)
		.forEach((cChannel: C_Channel) => {
			cChannel.disable();
		});
	}

	/**
	 * Adds a message
	 * @param {Message} message the message to add
	 */
	public addMessage(message: Message): void {
		this.messagesList.appendChild(new C_Message(message, this.client));
		this.messagesList.scrollTo(0, this.messagesList.scrollHeight);
	}

	/**
	 * Removes a message
	 * @param {number} messageId the id of the message to remove
	 */
	public removeMessage(messageId: number): void {
		this.toArray(this.messagesList.childNodes)
		.filter((cMessage: HTMLElement) => cMessage instanceof C_Message && cMessage.getMessage.getMessageId === messageId)
		.forEach((cMessage: C_Message) => {
			this.messagesList.removeChild(cMessage);
		});
	}

	/**
	 * Updates a message
	 * @param {Message} message the message to update
	 */
	public updateMessage(message: Message): void {
		this.toArray(this.messagesList.childNodes)
		.filter((cMessage: HTMLElement) => cMessage instanceof C_Message && cMessage.getMessage.getMessageId === message.getMessageId)
		.forEach((cMessage: C_Message) => {
			cMessage.update();
		});
	}

	/**
	 * Adds an user
	 * @param {User} user the user to add
	 */
	public addUser(user: User): void {
		this.usersList.appendChild(new C_User(user));
	}

	/**
	 * Removes an user
	 * @param {number} userId the id of the user to remove
	 */
	public removeUser(userId: number): void {
		this.toArray(this.usersList.childNodes)
		.filter((cUser: HTMLElement) => cUser instanceof C_User && cUser.getUser.getUserId === userId)
		.forEach((cUser: C_User) => {
			this.usersList.removeChild(cUser);
		});
	}

	/**
	 * Updates the user
	 * @param {User} user the user to update
	 */
	public updateUser(user: User): void {
		this.toArray(this.usersList.childNodes)
		.filter((cUser: HTMLElement) => cUser instanceof C_User && cUser.getUser.getUserId === user.getUserId)
		.forEach((cUser: C_User) => {
			cUser.update();
		});

		this.toArray(this.messagesList.childNodes)
		.filter((cMessage: HTMLElement) => cMessage instanceof C_Message && cMessage.getMessage.getMessageAuthorId === user.getUserId)
		.forEach((cMessage: C_Message) => {
			cMessage.update();
		});

		if (user === this.client.getCurrentUser()) {
			if (this.client.getCurrentUser().getUserIcon && this.userIconChange.src !== this.client.getCurrentUser().getUserIcon) {
				this.userIconChange.src = this.client.getCurrentUser().getUserIcon;
			}
			if (this.userNameChange.value !== this.client.getCurrentUser().getUserName) {
				this.userNameChange.value = this.client.getCurrentUser().getUserName;
			}
			if (this.userStatusChange.style.backgroundColor !== `var(--${this.client.getCurrentUser().getUserStatus})`) {
				this.userStatusChange.style.backgroundColor = `var(--${this.client.getCurrentUser().getUserStatus})`;
			}
		}
	}

	/**
	 * Creates an array for the childnodes
	 * @param {NodeList} node the childnodes arry
	 */
	private toArray(node: NodeList): any[] {
		return Array.from(node);
	}

}
