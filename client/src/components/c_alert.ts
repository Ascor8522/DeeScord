/**
 * Represents an alert element
 */
export class C_Alert extends HTMLElement {

	private message: string;

	/**
	 * Creates a new alert popup
	 * @param {string} message the alert message to display
	 */
	public constructor({message}: {message: string}) {
		super();
		this.message = message;
	}
}
