export class Message {
	private messageAuthorId: number;
	private messageChannelId: number;
	private messageContent: string;
	private messageId: number;
	private messageTimestamp: number;

	constructor(messageAuthorId: number = 0, messageChannelId: number = 0, messageContent: string = "Empty Message", messageId: number = 0, messageTimestamp: number = 0) {
		this.messageChannelId = messageChannelId;
		this.messageContent = messageContent;
		this.messageId = messageId;
		this.messageTimestamp = messageTimestamp;
		this.messageAuthorId = messageAuthorId;
	}
}
