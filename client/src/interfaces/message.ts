/**
 * Reprensents a message
 */
export class Message {
	private messageAuthorId: number;
	private messageChannelId: number;
	private messageContent: string;
	private messageId: number;
	private messageTimestamp: number;

	/**
	 * Creates a new message
	 * @param {number} messageAuthorId the id of the author
	 * @param {number} messageChannelId the id of the channel the message was sent in
	 * @param {string} messageContent the content of the message
	 * @param {number} messageId the if of the message
	 * @param {number} messageTimestamp the timestamp of the message
	 */
	constructor(messageAuthorId: number = 0, messageChannelId: number = 0, messageContent: string = "Empty Message", messageId: number = 0, messageTimestamp: number = 0) {
		this.messageChannelId = messageChannelId;
		this.messageContent = messageContent;
		this.messageId = messageId;
		this.messageTimestamp = messageTimestamp;
		this.messageAuthorId = messageAuthorId;
	}

	/**
	 * Returns the id of the author
	 */
	public get getMessageAuthorId(): number {
		return this.messageAuthorId;
	}

	/**
	 * Returns the id of the channel
	 */
	public get getMessageChannelId(): number {
		return this.messageChannelId;
	}

	/**
	 * Returns the content
	 */
	public get getMessageContent(): string {
		return this.messageContent;
	}

	/**
	 * Returns the id of the message
	 */
	public get getMessageId(): number {
		return this.messageId;
	}

	/**
	 * Returns the timestamp of the message
	 */
	public get getMessageTimestamp(): number {
		return this.messageTimestamp;
	}
}
