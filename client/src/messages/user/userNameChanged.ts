import { UserEvent } from "./userEvent";

/**
 * When a user changes name
 */
export class UserNameChanged extends UserEvent {
	/**
	 * Creates a new event
	 * @param {string} userName the name of the user
	 */
	public constructor(userName: string) {
		super("UserNameChanged", {
			userName,
		});
	}
}
