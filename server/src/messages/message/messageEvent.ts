import { Event } from "../event";

export abstract class MessageEvent extends Event {
	constructor(type: string, data: object) {
		super(data, type);
	}
}
