import { Event } from "../event";

/**
 * Base class for user events
 */
export abstract class UserEvent extends Event {
	/**
	 * @param {string} type the type of event
	 * @param {object} data the data of the event
	 */
	constructor(type: string, data: object) {
		super(type, data);
	}
}
