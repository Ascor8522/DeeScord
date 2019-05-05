import { ChannelEvent } from "./channelEvent";

export class ChannelTopic extends ChannelEvent {
	constructor(channelId: number, channelTopic: string) {
		super("ChannelTopic", {
			channelId,
			channelTopic,
		});
	}
}
