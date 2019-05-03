import { ChannelEvent } from "./channelEvent";

/**
 * When a channel is renamed
 */
export class ChannelRenamed extends ChannelEvent {
	/**
	 * Creates a new event
	 * @param {number} channelId the id of the channel renamed
	 * @param {string} channelName the name of the channel
	 */
	constructor(channelId: number, channelName: string) {
		super("ChannelRenamed", {
			channelId,
			channelName,
		});
	}
}
