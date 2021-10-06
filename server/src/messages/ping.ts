import { Event } from "./event";

export class Ping extends Event {
	constructor(ping: number) {
		super({
			ping,
		}, "Ping");
	}
}
