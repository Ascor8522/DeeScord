import { MessageEvent } from "./messageEvent";

/**
 * When a message is edited
 */
export class MessageEdited extends MessageEvent {
	/**
	 * Creates a new event
	 * @param {string} messageContent the content of the message
	 * @param {number} messageId the id of the message
	 */
	constructor(messageContent: string, messageId: number) {
		super("MessageEdited", {
			messageContent,
			messageId,
		});
	}
}
