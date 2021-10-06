import { Client } from "../controller/Client";
import { User } from "../interfaces/User";
import { clean } from "../utils/cleaner";

export class C_Mention extends HTMLElement {

	public static init(): void {
		customElements.define("c-mention", C_Mention);
	}

	private client: Client;
	private user: User | "everyone";

	public constructor({user, client}: {user: User | "everyone", client: Client}) {
		super();

		this.client = client;

		this.user = user;

		this.update();
	}

	public getUser(): User | "everyone" {
		return this.user;
	}

	public update(): void {
		if(this.innerHTML !== `@${this.user === "everyone" ?  "everyone" : clean(this.user.getName())}`) {
			this.innerHTML = `@${this.user === "everyone" ?  "everyone" : clean(this.user.getName())}`;
		}

		this.className = ((this.user === "everyone") || (this.user.getId === this.client.getCurrentUser().getId)) ? "me" : "";
	}
}
