import { UserEvent } from "./userEvent";

export class UserNameChanged extends UserEvent {
	constructor(userId: number, userName: string) {
		super("UserNameChanged", {
			userId,
			userName,
		});
	}
}
