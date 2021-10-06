import { User } from "../interfaces/User";
import { UserStatus } from "../interfaces/UserStatus";
import { clean } from "../utils/cleaner";

/**
 * Reprensnts a user element
 */
export class C_User extends HTMLElement {

	public static init(): void {
		customElements.define("c-user", C_User);
	}

	private user: User;

	private domUserIcon: HTMLImageElement;
	private domUserStatus: HTMLDivElement;
	private domUserName: HTMLDivElement;

	/**
	 * Creates a new user element
	 * @param {User} user the user
	 */
	public constructor({user}: {user: User}) {
		super();

		this.user = user;

		this.domUserIcon = document.createElement("img");
		this.domUserStatus = document.createElement("div");
		this.domUserName = document.createElement("div");

		this.domUserIcon.className = "userIcon";
		this.domUserIcon.alt = "";

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
	public getUser(): User {
		return this.user;
	}

	/**
	 * Updates the user
	 */
	public update(): void {
		if(this.className !== this.user.getStatus().toString() || UserStatus.OFFLINE.toString()) {
			this.className = this.user.getStatus().toString() || UserStatus.OFFLINE.toString();
		}

		if(this.domUserName.innerHTML !== clean(this.user.getName() || "")) {
			this.domUserName.innerHTML = clean(this.user.getName() || "");
		}

		if(this.domUserIcon.src !== this.user.getIconURL() ? this.user.getIconURL() : "/resource/img/user.svg") {
			this.domUserIcon.src = this.user.getIconURL() ? this.user.getIconURL() : "/resource/img/user.svg";
		}

		this.title = `User ${clean(this.user.getName() || "")}`;
	}
}
