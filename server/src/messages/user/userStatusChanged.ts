import { UserStatus } from "../../interfaces/userStatus";
import { UserEvent } from "./userEvent";

export class UserStatusChanged extends UserEvent {
	constructor(userId: number, userStatus: UserStatus) {
		super("UserStatusChanged", {
			userId,
			userStatus,
		});
	}
}
