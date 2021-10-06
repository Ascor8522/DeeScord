import { Event } from "./event";

/**
 * Pings the server
 */
export class Ping extends Event {
	/**
	 * Creates a new event
	 */
	public constructor() {
		super("Ping", {
			timestamp: Date.now(),
		});
	}
}
