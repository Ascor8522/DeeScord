import { C_Channel } from "./components/c_channel";
import { C_Convo } from "./components/c_convo";
import { C_Mention } from "./components/c_mention";
import { C_Message } from "./components/c_message";
import { C_Unread } from "./components/c_unread";
import { C_User } from "./components/c_user";

import { Client } from "./controller/client";
import { xhr } from "./xhr";

((): void => {
	try {
		customElements.define("c-channel", C_Channel);
		customElements.define("c-convo", C_Convo);
		customElements.define("c-mention", C_Mention);
		customElements.define("c-message", C_Message);
		customElements.define("c-unread", C_Unread);
		customElements.define("c-user", C_User);
	} catch (e) {
		console.error("Could not define custom elements");
		alert("[ERROR] This browser doesn't support custom elements. Please use a supported browser.");
	}

	try {
		const clientWorker: Worker = new Worker("./client/out/controller/client.js");
	} catch (e) {
		xhr("POST", window.location.host, "/error.php", {error: e});
	} finally {
		const client = new Client();
	}

})();

/*
localstorage last read message each channel
tick in channel for unread messages
*/
