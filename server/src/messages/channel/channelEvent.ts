import { Event } from "../event";

export abstract class ChannelEvent extends Event {
	constructor(type: string, data: object) {
		super(data, type);
	}
}
