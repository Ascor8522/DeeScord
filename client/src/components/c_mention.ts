import { Client } from "../controller/client";
import { User } from "../interfaces/user";
import { clean } from "../utils/cleaner";

export class C_Mention extends HTMLElement {
	private client: Client;

	private user: User | "everyone";

	constructor(user: User | "everyone", client: Client) {
		super();

		this.client = client;

		this.user = user;

		this.update();
	}

	public get getUser(): User | "everyone" {
		return this.user;
	}

	public update(): void {
		if (this.innerHTML !== `@${clean(typeof this.user === "string" ? "everyone" : this.user.getUserName)}`) {
			this.innerHTML = `@${clean(typeof this.user === "string" ? "everyone" : this.user.getUserName)}`;
		}

		this.className = this.user === "everyone" || this.user.getUserId === this.client.getCurrentUser().getUserId ? "me" : "";
	}
}
