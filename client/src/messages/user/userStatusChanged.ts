import { UserStatus } from "../../interfaces/userStatus";
import { UserEvent } from "./userEvent";

/**
 * When the user's status changes
 */
export class UserStatusChanged extends UserEvent {
	/**
	 * Creates a new event
	 * @param {UserStatus} userStatus the userstatus of the user
	 */
	constructor(userStatus: UserStatus) {
		super("UserStatusChanged", {
			userStatus,
		});
	}
}
