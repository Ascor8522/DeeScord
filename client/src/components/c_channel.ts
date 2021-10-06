import { Client } from "../controller/Client";
import { Channel } from "../interfaces/Channel";
import { clean } from "../utils/cleaner";

/**
 * Represents a channel element
 */
export class C_Channel extends HTMLElement {

	public static init(): void {
		customElements.define("c-channel", C_Channel);
	}

	private channel: Channel;
	private domChannelName: HTMLSpanElement;

	/**
	 * Creates a new channel element
	 * @param {Channel} channel the channel
	 * @param {Client} client a reference to the client
	 */
	public constructor({channel, client}: {channel: Channel, client: Client}) {
		super();

		this.setAttribute("contextmenu", "channelMenu");

		this.channel = channel;

		this.domChannelName = document.createElement("div");

		this.update();

		const div1 = document.createElement("div");
		div1.className = "channelIcon";

		this.appendChild(div1);
		this.appendChild(this.domChannelName);

		this.addEventListener("mousedown", async(): Promise<void> => {
			return client.joinChannel(this.channel.getId());
		});
	}

	/**
	 * Returns the channel object
	 */
	public getChannel(): Channel {
		return this.channel;
	}

	/**
	 * Updates the element
	 */
	public update(): void {
		if(this.domChannelName.innerHTML !== clean(this.channel.getName())) {
			this.domChannelName.innerHTML = clean(this.channel.getName());
		}

		this.title = `Channel ${clean(this.channel.getName())}`;
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
