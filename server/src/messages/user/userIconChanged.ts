import { UserEvent } from "./userEvent";

export class UserIconChanged extends UserEvent {
	constructor(userIcon: string, userId: number) {
		super("UserIconChanged", {
			userIcon,
			userId,
		});
	}
}
