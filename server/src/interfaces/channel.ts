export class Channel {
	private channelId: number;
	private channelName: string;
	private channelTopic: string;

	constructor(channelId: number = 0, channelName: string = "Unnamed Channel", channelTopic: string = "Unknown Topic") {
		this.channelId = channelId;
		this.channelName = channelName;
		this.channelTopic = channelTopic;
	}
}
