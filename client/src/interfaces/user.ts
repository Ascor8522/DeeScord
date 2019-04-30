import { UserStatus } from "./userStatus";

/**
 * Represents an user
 */
export class User {
	private userIcon: string;
	private userId: number;
	private userName: string;
	private userStatus: UserStatus;

	/**
	 * Creates a new user
	 * @param {string} userIcon the url of the user's icon
	 * @param {number} userId the if of the user
	 * @param {string} userName the name of the user
	 * @param {UserStatus} userStatus the status of the user
	 */
	constructor(userIcon: string, userId: number = 0, userName: string = "Unnamed User", userStatus: UserStatus = UserStatus.OFFLINE) {
		this.userIcon = userIcon;
		this.userId = userId;
		this.userName = userName;
		this.userStatus = userStatus;
	}

	/**
	 * Returns the user's icon url
	 */
	public get getUserIcon(): string {
		return this.userIcon;
	}

	/**
	 * Sets the user's icon url
	 * @param {string} userIcon the icon of the user
	 */
	public set setUserIcon(userIcon: string) {
		this.userIcon = userIcon;
	}

	/**
	 * Returns the id of the user
	 */
	public get getUserId(): number {
		return this.userId;
	}

	/**
	 * Returns the name of the user
	 */
	public get getUserName(): string {
		return this.userName;
	}

	/**
	 * Sets the name of the user
	 * @param {string} userName the name of the user
	 */
	public set setUserName(userName: string) {
		this.userName = userName;
	}

	/**
	 * Returns the status of the user
	 */
	public get getUserStatus(): UserStatus {
		return this.userStatus;
	}

	/**
	 * Sets the status of the user
	 * @param {UserStatus} userStatus the status of the user
	 */
	public set setUserStatus(userStatus: UserStatus) {
		this.userStatus = userStatus;
	}
}
