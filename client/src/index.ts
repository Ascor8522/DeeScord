import { C_Channel } from "./components/c_channel";
import { C_Message } from "./components/c_message";
import { C_Unread } from "./components/c_unread";
import { C_User } from "./components/c_user";
import { Client } from "./controller/client";
import { xhr } from "./xhr";

(() => {
	try {
		customElements.define("c-user", C_User);
		customElements.define("c-channel", C_Channel);
		customElements.define("c-message", C_Message);
		customElements.define("c-unread", C_Unread);
	} catch (e) {
		console.error("Could not define custom elements");
	}

	try {
		const client = new Client();
	} catch (e) {
		xhr("POST", window.location.host, "/error.php", {error: e});
	}

})();

/*
localstorage last read message each channel
tick in channel for unread messages
*/
