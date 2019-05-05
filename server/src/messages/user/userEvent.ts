import { Event } from "../event";

export abstract class UserEvent extends Event {
	constructor(type: string, data: object) {
		super(data, type);
	}
}
