import { Event } from "./event";

export class WhoAmI extends Event {
	constructor(userId: number) {
		super({
			userId,
		}, "WhoAmI");
	}
}
