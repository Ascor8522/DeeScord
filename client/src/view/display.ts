import { C_Channel } from "../components/C_Channel";
import { C_Convo } from "../components/C_Convo";
import { C_Message } from "../components/C_Message";
import { C_User } from "../components/C_User";
import { Client } from "../controller/Client";
import { Channel } from "../interfaces/Channel";
import { Message } from "../interfaces/Message";
import { User } from "../interfaces/User";

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
	public constructor(client: Client) {
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
		this.channelsList.appendChild(new C_Channel({channel, client: this.client}));

		if(this.client.getChannels().size === 1) {
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
		.filter((cChannel: HTMLElement) => cChannel instanceof C_Channel && cChannel.getChannel().getId() === channelId)
		.forEach((cChannel: C_Channel) => {
			this.channelsList.removeChild(cChannel);
		});

		if(this.client.getChannels().size === 0) {
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
		.filter((cChannel: HTMLElement) => cChannel instanceof C_Channel && cChannel.getChannel().getId() === channel.getId())
		.forEach((cChannel: C_Channel) => {
			cChannel.update();
		});

		if(channel.getId() === this.client.getCurrentChannelId()) {
			this.channelName.value = channel.getName();
			this.channelTopic.value = channel.getTopic();
		}
	}

	/**
	 * Joins a channel
	 * @param {Channel} channel the channel to join
	 */
	public joinChannel(channel: Channel): void {
		this.unjoinChannel();

		this.channelName.value = channel.getName();
		this.channelTopic.value = channel.getTopic();

		this.toArray(this.channelsList.childNodes)
		.filter((cChannel: HTMLElement) => cChannel instanceof C_Channel && cChannel.getChannel().getId() === channel.getId())
		.forEach((cChannel: C_Channel) => {
			cChannel.enable();
		});

		let previousMessageAuthor: number | null = null;
		let previousMessageTimestamp: number | null = null;
		channel.getMessages().forEach((message) => {
			this.addMessage(message, message.getAuthorId() === previousMessageAuthor && Math.floor(message.getTimestamp() / (60 * 1000)) === Math.floor((previousMessageTimestamp || 0) / (60 * 1000)));
			previousMessageAuthor = message.getAuthorId();
			previousMessageTimestamp = message.getTimestamp();
		});

		this.toArray(this.channelsList.childNodes)
		.filter((cChannel: HTMLElement) => cChannel instanceof C_Channel && cChannel.getChannel().getId() === channel.getId())
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
	 * @param {boolean} sameAuthor true if the author of the previous message is the same
	 */
	public addMessage(message: Message, sameAuthor: boolean): void {
		if(sameAuthor) {
			this.messagesList.appendChild(new C_Convo({message, client: this.client}));
		} else {
			this.messagesList.appendChild(new C_Message({message, client: this.client}));
		}
		this.messagesList.scrollTo(0, this.messagesList.scrollHeight);
	}

	/**
	 * Removes a message
	 * @param {number} messageId the id of the message to remove
	 */
	public removeMessage(messageId: number): void {
		this.toArray(this.messagesList.childNodes)
		.filter((cMessage: HTMLElement) => (cMessage instanceof C_Message || cMessage instanceof C_Convo) && cMessage.getMessage().getId() === messageId)
		.forEach((cMessage: C_Message | C_Convo) => {
			this.messagesList.removeChild(cMessage);
		});
	}

	/**
	 * Updates a message
	 * @param {Message} message the message to update
	 */
	public updateMessage(message: Message): void {
		this.toArray(this.messagesList.childNodes)
		.filter((cMessage: HTMLElement) => (cMessage instanceof C_Message || cMessage instanceof C_Convo) && cMessage.getMessage().getId() === message.getId())
		.forEach((cMessage: C_Message | C_Convo) => {
			cMessage.update();
		});
	}

	/**
	 * Adds an user
	 * @param {User} user the user to add
	 */
	public addUser(user: User): void {
		this.usersList.appendChild(new C_User({user}));
	}

	/**
	 * Removes an user
	 * @param {number} userId the id of the user to remove
	 */
	public removeUser(userId: number): void {
		this.toArray(this.usersList.childNodes)
		.filter((cUser: HTMLElement) => cUser instanceof C_User && cUser.getUser().getId() === userId)
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
		.filter((cUser: HTMLElement) => cUser instanceof C_User && cUser.getUser().getId() === user.getId())
		.forEach((cUser: C_User) => {
			cUser.update();
		});

		this.toArray(this.messagesList.childNodes)
		.filter((cMessage: HTMLElement) => cMessage instanceof C_Message && cMessage.getMessage().getAuthorId() === user.getId())
		.forEach((cMessage: C_Message) => {
			cMessage.update();
		});

		if(user === this.client.getCurrentUser()) {
			if(this.client.getCurrentUser().getIconURL() && this.userIconChange.src !== this.client.getCurrentUser().getIconURL()) {
				this.userIconChange.src = this.client.getCurrentUser().getIconURL();
			}
			if(this.userNameChange.value !== this.client.getCurrentUser().getName()) {
				this.userNameChange.value = this.client.getCurrentUser().getName();
			}
			if(this.userStatusChange.style.backgroundColor !== `var(--${this.client.getCurrentUser().getStatus()})`) {
				this.userStatusChange.style.backgroundColor = `var(--${this.client.getCurrentUser().getStatus()})`;
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
