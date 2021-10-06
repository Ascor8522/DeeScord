/**
 * Represents an unread bar
 */
export class C_Unread extends HTMLElement {

	public static init(): void {
		customElements.define("c-unread", C_Unread);
	}

	/**
	 * Creates a new unread element
	 */
	public constructor() {
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
