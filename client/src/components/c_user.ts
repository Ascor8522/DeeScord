import { User } from "../interfaces/user";
import { clean } from "../utils/cleaner";

/**
 * Reprensnts a user element
 */
export class C_User extends HTMLElement {
	private user: User;

	private domUserIcon: HTMLImageElement;
	private domUserStatus: HTMLDivElement;
	private domUserName: HTMLDivElement;

	/**
	 * Creates a new user element
	 * @param {User} user the user
	 */
	constructor(user: User) {
		super();

		this.user = user;

		this.domUserIcon = document.createElement("img");
		this.domUserStatus = document.createElement("div");
		this.domUserName = document.createElement("div");

		this.domUserIcon.className = "userIcon";
		this.domUserIcon.src = this.user.getUserIcon ? this.user.getUserIcon : "/resource/icon/user.svg";
		this.domUserIcon.alt = "User icon";

		this.update();

		const div1 = document.createElement("div");
		div1.appendChild(this.domUserIcon);
		div1.appendChild(this.domUserStatus);

		this.appendChild(div1);
		this.appendChild(this.domUserName);
	}

	/**
	 * Returns the user
	 */
	public get getUser(): User {
		return this.user;
	}

	/**
	 * Updates the user
	 */
	public update(): void {
		this.className = "";
		this.classList.add(this.user.getUserStatus.toString());

		this.domUserName.innerHTML = clean(this.user.getUserName);
	}
}
