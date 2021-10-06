import { ChannelEvent } from "./channelEvent";

/**
 * When a channel is deleted
 */
export class ChannelDeleted extends ChannelEvent {
	/**
	 * Creates a new event
	 * @param {number} channelId the id of the deleted channel
	 */
	public constructor(channelId: number) {
		super("ChannelDeleted", {
			channelId,
		});
	}
}
