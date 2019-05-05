import { Response } from "./response";

export abstract class Event extends Response {
	constructor(data: object, type: string) {
		super(data, type);
	}
}
