import { MessageEvent } from "./messageEvent";

/**
 * When a message is sent
 */
export class MessageSent extends MessageEvent {
	/**
	 * Creates a new event
	 * @param {number} messageAuthorId the id of the message author
	 * @param {number} messageChannelId the id of the chanel
	 * @param {string} messageContent the content of the message
	 */
	public constructor(messageAuthorId: number, messageChannelId: number, messageContent: string) {
		super("MessageSent", {
			messageAuthorId,
			messageChannelId,
			messageContent,
		});
	}
}
