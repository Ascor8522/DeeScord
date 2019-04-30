/**
 * Represents an unread bar
 */
export class C_Unread extends HTMLElement {
	/**
	 * Creates a new unread element
	 */
	constructor() {
		super();

		const div1: HTMLDivElement = document.createElement("div");
		const div2: HTMLDivElement = document.createElement("div");

		const span1: HTMLSpanElement = document.createElement("span");
		span1.innerText = "New Messages";

		this.appendChild(div1);
		this.appendChild(span1);
		this.appendChild(div2);
	}
}
