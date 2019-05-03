import { MessageEvent } from "./messageEvent";

/**
 * Whane a message is deleted
 */
export class MessageDeleted extends MessageEvent {
	/**
	 * Creates a new event
	 * @param {number} messageId the id of the message
	 */
	constructor(messageId: number) {
		super("MessageDeleted", {
			messageId,
		});
	}
}
