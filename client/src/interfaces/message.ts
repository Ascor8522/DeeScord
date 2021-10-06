/**
 * Reprensents a message
 */
export class Message {
	private authorId: number;
	private channelId: number;
	private content: string;
	private id: number;
	private timestamp: number;

	/**
	 * Creates a new message
	 * @param {number} authorId the id of the author
	 * @param {number} channelId the id of the channel the message was sent in
	 * @param {string} content the content of the message
	 * @param {number} id the if of the message
	 * @param {number} timestamp the timestamp of the message
	 */
	public constructor(authorId: number = 0, channelId: number = 0, content: string = "Empty Message", id: number = 0, timestamp: number = 0) {
		this.channelId = channelId;
		this.content = content;
		this.id = id;
		this.timestamp = timestamp;
		this.authorId = authorId;
	}

	/**
	 * Returns the id of the author
	 */
	public getAuthorId(): number {
		return this.authorId;
	}

	/**
	 * Returns the id of the channel
	 */
	public getChannelId(): number {
		return this.channelId;
	}

	/**
	 * Returns the content
	 */
	public getContent(): string {
		return this.content;
	}

	/**
	 * Returns the id of the message
	 */
	public getId(): number {
		return this.id;
	}

	/**
	 * Returns the timestamp of the message
	 */
	public getTimestamp(): number {
		return this.timestamp;
	}
}
