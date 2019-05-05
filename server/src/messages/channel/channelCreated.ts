import { ChannelEvent } from "./channelEvent";

export class ChannelCreated extends ChannelEvent {
	constructor(channelId: number, channelName: string, channelTopic: string) {
		super("ChannelCreated", {
			channelId,
			channelName,
			channelTopic,
		});
	}
}
