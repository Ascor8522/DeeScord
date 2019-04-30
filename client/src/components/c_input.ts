/**
 * Represents an imput
 */
export class C_Input extends HTMLElement {
	/**
	 * Ceates a new input
	 * @param {string} message the message to display
	 * @param {Function} callback the callback function to execute when the button is pressed
	 */
	constructor(message: string, callback: (answer: string) => void) {
		super();
	}
}
