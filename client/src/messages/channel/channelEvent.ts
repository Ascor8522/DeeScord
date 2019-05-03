import { Event } from "../event";

/**
 * Base class for the channel events
 */
export abstract class ChannelEvent extends Event {
	/**
	 * @param {string} type the type of event
	 * @param {object} data the daya of the event
	 */
	constructor(type: string, data: object) {
		super(type, data);
	}
}
