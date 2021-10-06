import { Client } from "../controller/Client";
import { Message } from "../interfaces/Message";
import { C_Message } from "./C_Message";

/**
 * Represents a message following a message from the same user
 */
export class C_Convo extends C_Message {

	public static init(): void {
		customElements.define("c-convo", C_Convo);
	}

	/**
	 * Creates a new convo message
	 * @param {Message} message the message
	 * @param {Client} client a reference to the client
	 */
	public constructor({message, client}: {message: Message, client: Client}) {
		super({message, client});
	}
}
