import { Client } from "../controller/Client";
import { Message } from "../interfaces/Message";
import { clean, extractLinks, format, replaceTagsIdsToNames } from "../utils/cleaner";
import { C_Embed } from "./C_Embed";

/**
 * Represents a message
 */
export class C_Message extends HTMLElement {

	public static init(): void {
		customElements.define("c-message", C_Message);
	}

	private client: Client;
	private message: Message;

	private domMessageAuthorIcon: HTMLImageElement;
	private domMessageAuthor: HTMLSpanElement;
	private domMessageTimestamp: HTMLSpanElement;
	private domMessageContent: HTMLDivElement;
	private domMessageEmbeds: HTMLDivElement;

	/**
	 * Creates a new message
	 * @param {Message} message the message
	 * @param {Client} client a reference to the client
	 */
	public constructor({message, client}: {message: Message, client: Client}) {
		super();

		this.client = client;

		this.message = message;

		this.domMessageAuthorIcon = document.createElement("img");
		this.domMessageAuthor = document.createElement("span");
		this.domMessageTimestamp = document.createElement("span");
		this.domMessageContent = document.createElement("div");
		this.domMessageEmbeds = document.createElement("div");

		if(this.message.getAuthorId() === this.client.getCurrentUserId()) {
			this.classList.add("own");
		}

		this.domMessageAuthorIcon.className = "userIcon";
		this.domMessageAuthorIcon.alt = "";

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
	public getMessage(): Message {
		return this.message;
	}

	/**
	 * Updates the message
	 */
	public update(): void {
		if(this.domMessageAuthor.innerHTML !== clean(this.client.getUserNameById(this.message.getAuthorId()))) {
			this.domMessageAuthor.innerHTML = clean(this.client.getUserNameById(this.message.getAuthorId()));
		}

		if(this.domMessageTimestamp.innerText !== this.displayDate(this.message.getTimestamp())) {
			this.domMessageTimestamp.innerText = this.displayDate(this.message.getTimestamp());
		}

		if(this.domMessageAuthorIcon.src !== this.client.getUserIconById(this.message.getAuthorId())) {
			this.domMessageAuthorIcon.src = this.client.getUserIconById(this.message.getAuthorId());
		}

		if(this.domMessageContent.innerHTML !== replaceTagsIdsToNames(format(clean(this.message.getContent())), this.client)) {
			this.domMessageContent.innerHTML = replaceTagsIdsToNames(format(clean(this.message.getContent())), this.client);
		}

		Array.from(this.domMessageEmbeds.children).forEach((child: Element): void => {
			this.domMessageEmbeds.removeChild(child);
		});
		this.extractEmbeds();

		this.title = `Sent ${this.displayDate(this.message.getTimestamp())} by ${clean(this.client.getUserNameById(this.message.getAuthorId()))}`;
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
				str = `Last ${["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][date.getDay()]} at ${date.toLocaleTimeString().slice(0, -3)}`;
				break;
			default:
				return `${date.toLocaleDateString()} at ${date.toLocaleTimeString().slice(0, -3)}`;
		}
		return str;
	}

	/**
	 * Extract embeds in the message content
	 */
	private extractEmbeds() {
		const links = extractLinks(this.message.getContent());
		if(links) {
			for (const link of links) {
				this.domMessageEmbeds.appendChild(new C_Embed({ color: "#ff0000", author: link, url: link, title: "test", description: "test description", fields: null, imageURL: null, footer: null }));
			}
		}
	}
}
