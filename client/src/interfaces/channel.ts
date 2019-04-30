import { Message } from "./message";

/**
 * Represents a channel
 */
export class Channel {
	private channelId: number;
	private channelFetched: boolean = false;
	private channelLastRead: number | undefined = 0;
	private channelMessages: Message[] = [];
	private channelName: string;
	private channelTopic: string;

	/**
	 * Creates a new channel
	 * @param {number} channelId the id of the channel
	 * @param {number} channelLastRead the id of the last message read
	 * @param {Array} channelMessages the messages of the channel
	 * @param {string} channelName the name of the channel
	 * @param {string} channelTopic the topic of the channel
	 */
	constructor(channelId: number = 0, channelLastRead: number = 0, channelMessages: Message[] = [], channelName: string = "Unnamed Channel", channelTopic: string = "Unknown Topic") {
		this.channelId = channelId;
		this.channelFetched = false;
		this.channelLastRead = undefined;
		this.channelMessages = channelMessages;
		this.channelName = channelName;
		this.channelTopic = channelTopic;
	}

	/**
	 * Returns the id of the channel
	 */
	public get getChannelId(): number {
		return this.channelId;
	}

	/**
	 * Returns true if the channel has been fetched already
	 */
	public get getChannelFetched(): boolean {
		return this.channelFetched;
	}

	/**
	 * Returns the id of the last message read
	 */
	public get getChannelLastRead(): number | undefined {
		return this.channelLastRead;
	}

	/**
	 * Sets the id of the last message read
	 * @param {number} lastReadMessageId the id of the last message read
	 */
	public set setChannelLastRead(lastReadMessageId: number) {
		this.channelLastRead = lastReadMessageId;
	}

	/**
	 * Returns the messages in the channel
	 */
	public get getChannelMessages(): Message[] {
		return this.channelMessages;
	}

	/**
	 * Adds a message in the channel
	 * @param {Message} message the message to add
	 */
	public addMessage(message: Message): void {
		this.channelMessages.push(message);
	}

	/**
	 * Returns the name of the channel
	 */
	public get getChannelName(): string {
		return this.channelName;
	}

	/**
	 * Sets the name of the channel
	 */
	public set setChannelName(channelName: string) {
		this.channelName = channelName;
	}

	/**
	 * Returns the topic of the channel
	 */
	public get getChannelTopic(): string {
		return this.channelTopic;
	}

	/**
	 * Sets the topic of the channel
	 */
	public set setChannelTopic(channelTopic: string) {
		this.channelTopic = channelTopic;
	}

	/**
	 * Sets the channel as fetched
	 */
	public fetch(): void {
		this.channelFetched = true;
	}
}
