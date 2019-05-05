import { ChannelEvent } from "./channelEvent";

export class ChannelRenamed extends ChannelEvent {
	constructor(channelId: number, channelName: string) {
		super("ChannelRenamed", {
			channelId,
			channelName,
		});
	}
}
