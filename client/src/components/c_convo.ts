import { Client } from "../controller/client";
import { Message } from "../interfaces/message";
import { C_Message } from "./c_message";

/**
 * Represents a message following a message from the same user
 */
export class C_Convo extends C_Message {

	/**
	 * Creates a new convo message
	 * @param {Message} message the message
	 * @param {Client} client a reference to the client
	 */
	constructor(message: Message, client: Client) {
		super(message, client);
	}
}
