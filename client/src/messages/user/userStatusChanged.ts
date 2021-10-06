import { UserStatus } from "../../interfaces/UserStatus";
import { UserEvent } from "./userEvent";

/**
 * When the user's status changes
 */
export class UserStatusChanged extends UserEvent {
	/**
	 * Creates a new event
	 * @param {UserStatus} userStatus the userstatus of the user
	 */
	public constructor(userStatus: UserStatus) {
		super("UserStatusChanged", {
			userStatus,
		});
	}
}
