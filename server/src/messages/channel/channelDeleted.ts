import { ChannelEvent } from "./channelEvent";

export class ChannelDeleted extends ChannelEvent {
	constructor(channelId: number) {
		super("ChannelDeleted", {
			channelId,
		});
	}
}
