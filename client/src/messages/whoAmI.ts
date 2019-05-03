import { Event } from "./event";

/**
 * Ask the server what is the current user
 */
export class WhoAmI extends Event {
	/**
	 * Creates a new event
	 */
	constructor() {
		super("WhoAmI", {});
	}
}
