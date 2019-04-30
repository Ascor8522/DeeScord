import { Client } from "../controller/client";
import { Channel } from "../interfaces/channel";
import { clean } from "../utils/cleaner";

/**
 * Represents a channel element
 */
export class C_Channel extends HTMLElement {
	private channel: Channel;
	private domChannelName: HTMLSpanElement;

	/**
	 * Creates a new channel element
	 * @param {Channel} channel the channel
	 * @param {Client} client a reference to the client
	 */
	constructor(channel: Channel, client: Client) {
		super();

		this.setAttribute("contextmenu", "channelMenu");

		this.channel = channel;

		this.domChannelName = document.createElement("div");

		this.update();

		const div1 = document.createElement("div");
		div1.className = "channelIcon";

		this.appendChild(div1);
		this.appendChild(this.domChannelName);

		this.addEventListener("mousedown", (): void => {
			client.joinChannel(this.channel.getChannelId);
		});
	}

	/**
	 * Returns the channel object
	 */
	public get getChannel(): Channel {
		return this.channel;
	}

	/**
	 * Updates the element
	 */
	public update(): void {
		this.domChannelName.innerText = clean(this.channel.getChannelName);
	}

	/**
	 * Sets the channel as selected
	 */
	public enable(): void {
		this.classList.add("current");
	}

	/**
	 * Sets the channel as not selected
	 */
	public disable(): void {
		this.classList.remove("current");
	}
}
