import { UserEvent } from "./userEvent";

/**
 * When a user changes icon
 */
export class UserIconChanged extends UserEvent {
	/**
	 * Creates a new event
	 * @param {string} userIcon the url of the user's icon
	 */
	constructor(userIcon: string) {
		super("UserIconChanged", {
			userIcon,
		});
	}
}
