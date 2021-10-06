import { ChannelEvent } from "./channelEvent";

/**
 * When the topic is changed
 */
export class ChannelTopic extends ChannelEvent {
	/**
	 * Creates a new event
	 * @param {number} channelId the id of the channal
	 * @param {string} channelTopic the topic of the channel
	 */
	public constructor(channelId: number, channelTopic: string) {
		super("ChannelTopic", {
			channelId,
			channelTopic,
		});
	}
}
