import { getCookie } from "../utils/cookie";

/**
 * Base class for all events
 */
export abstract class Response {
	private type: string;
	private data: any;
	private token: string;

	/**
	 * Creates a new event
	 * @param {string} type the type of event
	 * @param {object} data the data of the event
	 */
	constructor(type: string, data: any) {
		this.type = type;
		this.data = data;
		this.token = getCookie("token");
	}
}
