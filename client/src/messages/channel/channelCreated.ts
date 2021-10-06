import { ChannelEvent } from "./channelEvent";

/**
 * When a channel is created
 */
export class ChannelCreated extends ChannelEvent {
	/**
	 * Creates a new event
	 * @param {string} channelName the name of the channel
	 * @param {string} channelTopic the topic of the channel
	 */
	public constructor(channelName: string, channelTopic: string) {
		super("ChannelCreated", {
			channelName,
			channelTopic,
		});
	}
}
