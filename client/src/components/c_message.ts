import { Client } from "../controller/client";
import { Message } from "../interfaces/message";
import { clean, format } from "../utils/cleaner";

/**
 * Represents a message
 */
export class C_Message extends HTMLElement {
	private client: Client;

	private message: Message;

	private domMessageAuthorIcon: HTMLImageElement;
	private domMessageAuthor: HTMLSpanElement;
	private domMessageTimestamp: HTMLSpanElement;
	private domMessageContent: HTMLDivElement;

	/**
	 * Creates a new message
	 * @param {Message} message the message
	 * @param {Client} client a reference to the client
	 */
	constructor(message: Message, client: Client) {
		super();

		this.client = client;

		this.message = message;

		this.domMessageAuthorIcon = document.createElement("img");
		this.domMessageAuthor = document.createElement("span");
		this.domMessageTimestamp = document.createElement("span");
		this.domMessageContent = document.createElement("div");

		if (this.message.getMessageAuthorId === this.client.currentUserId) {
			this.classList.add("own");
		}

		this.domMessageAuthorIcon.className = "userIcon";
		this.domMessageAuthorIcon.alt = "/resource/icon/user.svg";

		this.domMessageAuthor.className = "messageAuthor";

		this.domMessageTimestamp.className = "messageTimestamp";

		this.domMessageContent.className = "messageContent";

		this.update();

		const span1 = document.createElement("span");
		span1.appendChild(this.domMessageAuthorIcon);

		const span2 = document.createElement("span");
		span2.appendChild(this.domMessageAuthor);
		span2.appendChild(this.domMessageTimestamp);
		span2.appendChild(this.domMessageContent);

		this.append(span1);
		this.appendChild(span2);
	}

	/**
	 * Returns the message
	 */
	public get getMessage(): Message {
		return this.message;
	}

	/**
	 * Updates the message
	 */
	public update(): void {
		if (this.domMessageAuthor.innerHTML !== clean(this.client.getUserNameById(this.message.getMessageAuthorId))) {
			this.domMessageAuthor.innerHTML = clean(this.client.getUserNameById(this.message.getMessageAuthorId));
		}

		if (this.domMessageTimestamp.innerText !== this.displayDate(this.message.getMessageTimestamp)) {
			this.domMessageTimestamp.innerText = this.displayDate(this.message.getMessageTimestamp);
		}

		if (this.domMessageAuthorIcon.src !== this.client.getUserIconById(this.message.getMessageAuthorId)) {
			this.domMessageAuthorIcon.src = this.client.getUserIconById(this.message.getMessageAuthorId);
		}

		if (this.domMessageContent.innerHTML !== format(clean(this.message.getMessageContent))) {
			this.domMessageContent.innerHTML = format(clean(this.message.getMessageContent));
		}

		this.title = `Sent ${this.displayDate(this.message.getMessageTimestamp)} by ${clean(this.client.getUserNameById(this.message.getMessageAuthorId))}`;
	}

	/**
	 * Returns a string with the date of the message
	 * @param {number} timestamp the timestamp of the message
	 */
	private displayDate(timestamp: number): string {
		let str: string = "";
		const date: Date = new Date(timestamp);
		const today: Date = new Date();
		today.setHours(0, 0, 0, 0);
		const yesterday: Date = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		yesterday.setHours(0, 0, 0, 0);
		const week: Date = new Date();
		week.setDate(yesterday.getDate() - 7);
		week.setHours(0, 0, 0, 0);

		switch (true) {
			case timestamp >= today.getTime():
				str = `Today at ${date.toLocaleTimeString().slice(0, -3)}`;
				break;
			case timestamp >= yesterday.getTime():
				str = `Yesterday at ${date.toLocaleTimeString().slice(0, -3)}`;
				break;
			case timestamp >= week.getTime():
				str = `Last ${["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Daturday"][date.getDay()]} at ${date.toLocaleTimeString().slice(0, -3)}`;
				break;
			default:
				return `${date.toLocaleDateString()} at ${date.toLocaleTimeString().slice(0, -3)}`;
		}
		return str;
	}
}
