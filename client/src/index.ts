import { C_Channel } from "./components/C_Channel";
import { C_Convo } from "./components/C_Convo";
import { C_Embed } from "./components/C_Embed";
import { C_Mention } from "./components/C_Mention";
import { C_Message } from "./components/C_Message";
import { C_Unread } from "./components/C_Unread";
import { C_User } from "./components/C_User";

import { Client } from "./controller/Client";

try {
	[
		C_Channel,
		C_Convo,
		C_Embed,
		C_Mention,
		C_Message,
		C_Unread,
		C_User,
	].forEach((c: {init: () => void}): void => c.init());
} catch (e) {
	console.error("Could not define custom elements");
	alert("[ERROR] This browser doesn't support custom elements. Please use a supported browser.");
}

const client = new Client();

/*
localstorage last read message each channel
tick in channel for unread messages
*/
