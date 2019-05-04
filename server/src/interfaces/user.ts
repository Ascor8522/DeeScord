import { UserStatus } from "./userStatus";

export class User {
	private userIcon: string;
	private userId: number;
	private userName: string;
	private userStatus: UserStatus;

	constructor(userIcon: string, userId: number = 0, userName: string = "Unnamed User", userStatus: UserStatus = UserStatus.OFFLINE) {
		this.userIcon = userIcon;
		this.userId = userId;
		this.userName = userName;
		this.userStatus = userStatus;
	}
}
