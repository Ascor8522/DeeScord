import { Response } from "./response";

export class Error extends Response {
	constructor(code: number, message: string) {
		super({
			code,
			message,
		}, "Error");
	}
}
