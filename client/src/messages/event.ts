import { Response } from "./response";

/**
 * Base class for all events
 */
export abstract class Event extends Response {
	/**
	 * Creates a new event
	 * @param {string} type the type of event
	 * @param {object} data the data of the vent
	 */
	constructor(type: string, data: object) {
		super(type, data);
	}
}
