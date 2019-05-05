export abstract class Response {
	private data: object;
	private type: string;

	constructor(data: object, type: string) {
		this.data = data;
		this.type = type;
	}
}
