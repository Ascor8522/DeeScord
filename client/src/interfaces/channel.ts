import { Message } from "./Message";

/**
 * Represents a channel
 */
export class Channel {
	private fetched: boolean = false;
	private id: number;
	private lastReadMessageId: number | undefined = 0;
	private messages: Message[] = [];
	private name: string;
	private topic: string;

	/**
	 * Creates a new channel
	 * @param {number} id the id of the channel
	 * @param {number} lastReadMessageId the id of the last message read
	 * @param {Array} messages the messages of the channel
	 * @param {string} name the name of the channel
	 * @param {string} topic the topic of the channel
	 */
	public constructor(id: number = 0, lastReadMessageId: number = 0, messages: Message[] = [], name: string = "Unnamed Channel", topic: string = "Unknown Topic") {
		this.id = id;
		this.fetched = false;
		this.lastReadMessageId = undefined;
		this.messages = messages;
		this.name = name;
		this.topic = topic;
	}

	/**
	 * Returns true if the channel has been fetched already
	 */
	public isFetched(): boolean {
		return this.fetched;
	}

	/**
	 * Sets the channel as fetched
	 */
	public async fetch(): Promise<void> {
		return new Promise((resolve, reject) => {

		})
		.then(() => void (this.fetched = true));
	}

	/**
	 * Returns the id of the channel
	 */
	public getId(): number {
		return this.id;
	}



	/**
	 * Returns the id of the last message read
	 */
	public getLastReadMessageId(): number | undefined {
		return this.lastReadMessageId;
	}

	/**
	 * Sets the id of the last message read
	 * @param {number} lastReadMessageId the id of the last message read
	 */
	public readMessage(lastReadMessageId: number) {
		this.lastReadMessageId = lastReadMessageId;
	}

	/**
	 * Returns the messages in the channel
	 */
	public getMessages(): Message[] {
		return this.messages;
	}

	/**
	 * Adds a message in the channel
	 * @param {Message} message the message to add
	 */
	public addMessage(message: Message): void {
		this.messages.push(message);
	}

	/**
	 * Returns the name of the channel
	 */
	public getName(): string {
		return this.name;
	}

	/**
	 * Sets the name of the channel
	 */
	public setName (channelName: string) {
		this.name = channelName;
	}

	/**
	 * Returns the topic of the channel
	 */
	public getTopic(): string {
		return this.topic;
	}

	/**
	 * Sets the topic of the channel
	 */
	public setTopic (channelTopic: string) {
		this.topic = channelTopic;
	}

}
