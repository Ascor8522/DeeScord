import { Event } from "../event";

/**
 * Base class for the messages events
 */
export abstract class MessageEvent extends Event {
	/**
	 * @param {string} type the type of event
	 * @param {object} data the object linked to the event
	 */
	public constructor(type: string, data: object) {
		super(type, data);
	}
}
