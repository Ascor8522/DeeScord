import { UserStatus } from "./UserStatus";

/**
 * Represents an user
 */
export class User {
	private iconURL: string;
	private id: number;
	private name: string;
	private status: UserStatus;

	/**
	 * Creates a new user
	 * @param {string} iconURL the url of the user's icon
	 * @param {number} id the if of the user
	 * @param {string} name the name of the user
	 * @param {UserStatus} status the status of the user
	 */
	public constructor(iconURL: string, id: number = 0, name: string = "Unnamed User", status: UserStatus = UserStatus.OFFLINE) {
		this.iconURL = iconURL;
		this.id = id;
		this.name = name;
		this.status = status;
	}

	/**
	 * Returns the user's icon url
	 */
	public getIconURL (): string {
		return this.iconURL;
	}

	/**
	 * Sets the user's icon url
	 * @param {string} userIcon the icon of the user
	 */
	public setIconURL (userIcon: string) {
		this.iconURL = userIcon;
	}

	/**
	 * Returns the id of the user
	 */
	public getId (): number {
		return this.id;
	}

	/**
	 * Returns the name of the user
	 */
	public getName (): string {
		return this.name;
	}

	/**
	 * Sets the name of the user
	 * @param {string} userName the name of the user
	 */
	public setName (userName: string): void {
		this.name = userName;
	}

	/**
	 * Returns the status of the user
	 */
	public getStatus (): UserStatus {
		return this.status;
	}

	/**
	 * Sets the status of the user
	 * @param {UserStatus} userStatus the status of the user
	 */
	public setStatus (userStatus: UserStatus): void {
		this.status = userStatus;
	}
}
