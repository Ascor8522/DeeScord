import { C_Mention } from "../components/C_Mention";
import { Client } from "../controller/Client";
import { User } from "../interfaces/User";

/**
 * Cleans and parses text to avoid html/javascript injection
 * @param {string} input the messageto clean
 */
export function clean(input: string): string {
	input = input.trim();

	input = replaceAll(input, /&(?!amp;)/gi, "&amp;", null);
	input = replaceAll(input, /\</gi, "&lt;", null);
	input = replaceAll(input, /\>/gi, "&gt;", null);
	input = replaceAll(input, /\"/gi, "&quot;", null);
	input = replaceAll(input, /\'/gi, "&apos;", null);
	input = replaceAll(input, /\t/gi, "&emsp;", null);

	return input;
}

export function format(input: string): string {
	input = input.trim();

	input = replaceAll(input, /```(?:[\n]|<br>)*((?:[\n]|.)*)(?:[\n]|<br>)*```/gi, "<code>$1</code>", null);
	input = replaceAll(input, /\n/gi, "<br>", null);
	input = replaceAll(input, /`(?:[\n]|<br>)*((?:[\n]|.)*)(?:[\n]|<br>)*`/gi, "<pre>$1</pre>", null);
	input = replaceAll(input, /\*\*(.+)\*\*/gi, "<b>$1</b>", null);
	input = replaceAll(input, /\*(.+)\*/gi, "<i>$1</i>", null);
	input = replaceAll(input, /\_\_(.+)\_\_/gi, "<u>$1</u>", null);
	input = replaceAll(input, /\~\~(.+)\~\~/gi, "<s>$1</s>", null);
	input = replaceURL(input, /[a-z][a-z0-9+.-]*:\/\/(?:(?:[a-z0-9][-a-z0-9@:%._\+~#=]*\.[a-z]{2,6})|(?:[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})|(?:[a-z0-9]))(?:[-a-z0-9@:%_\+.~#?&/=()]*)?/gi);
	input = replaceAll(input, /^\/shrug(?:$| ((?:.|\n)*))/gi, "$1 ¯\\_(ツ)_/¯", null);
	input = replaceAll(input, /^\/tableflip(?:$| ((?:.|\n)*))/gi, "$1 (╯°□°）╯︵ ┻━┻", null);
	input = replaceAll(input, /^\/unflip(?:$| ((?:.|\n)*))/gi, "$1 ┬─┬ ノ( ゜-゜ノ)", null);
	input = replaceAll(input, /^\/me(?:$| ((?:.|\n)*))/gi, "<i>$1</i>", null);

	return input;
}

export function replaceTagsNamesToIds(input: string, client: Client): string {
	return replaceAll(input, /@[a-z0-9]+(?![^&lt;]*&gt;)/gi, null, (match: string): string => {
		match = match.substring(1);
		let mention: User | undefined;
		for (const user of client.getUsers().values()) {
			if(user.getName() === match) {
				mention = user;
				break;
			}
		}
		if(mention !== undefined && mention !== null) {
			return `<@${mention.getId.toString()}>`;
		} else {
			return `@${match}`;
		}
	});
}

export function replaceTagsIdsToNames(input: string, client: Client): string {
	return replaceAll(input, /&lt;@(.+)&gt;/gi, null, (match: string): string => {
		match = match.substring(5, match.length - 4);
		if(match === "everyone") {
			return new C_Mention({user: "everyone", client}).outerHTML;
		} else {
			let mention: User | undefined;
			for (const user of client.getUsers().values()) {
				if(user.getId.toString() === match) {
					mention = user;
					break;
				}
			}
			return ((mention !== null) && (mention !== undefined)) ? new C_Mention({user: mention, client}).outerHTML : `<@${match}>`;
		}
	});
}

/**
 * Replaces all patterns
 * @param {string} input the message to replace
 * @param {RegExp} before the regex of what to remaplce
 * @param {string} after the string as replacement
 */
function replaceAll(input: string, before: RegExp, after: string | null, fun: ((match: string) => string) | null): string {
	let watchdog = 0;
	while (before.test(input)) {
		if(after) {
			input = input.replace(before, after);
		} else if(fun) {
			input = input.replace(before, fun);
		}
		watchdog++;
		if(watchdog > 20) {
			console.error("watchdog");
			break;
		}
	}
	return input;
}

/**
 * Replaces all patterns
 * @param {string} input the message to replace
 * @param {RegExp} before the regex of what to remaplce
 * @param {string} after the string as replacement
 */
function replaceFirst(input: string, before: RegExp, after: string): string {
	return input.replace(before, after);
}

/**
 * Sets all url as links
 * @param {string} input the message
 * @param {RegExp} before the regex to find links
 */
function replaceURL(input: string, before: RegExp): string {
	const matches = input.match(before);
	const split = input.split(before);
	let str = "";

	for (let i = 0; i < split.length - 1; i++) {
		str += split[i] + '<a href="' + matches![i] + '" target="_blank">' + matches![i] + "</a>";
	}

	str += split[split.length - 1];

	return str;
}

export function extractLinks(text: string): string[] {
	const links: string[] = [];
	if(/[a-z][a-z0-9+.-]*:\/\/(?:(?:[a-z0-9][-a-z0-9@:%._\+~#=]*\.[a-z]{2,6})|(?:[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})|(?:[a-z0-9]))(?:[-a-z0-9@:%_\+.~#?&/=()]*)?/gi.test(text)) {
		let i = 0;
		for (const match of /[a-z][a-z0-9+.-]*:\/\/(?:(?:[a-z0-9][-a-z0-9@:%._\+~#=]*\.[a-z]{2,6})|(?:[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})|(?:[a-z0-9]))(?:[-a-z0-9@:%_\+.~#?&/=()]*)?/gi.exec(text) || []) {
			if(i > 0) {
				links.push(match);
			}
			i++;
		}
	}
	return links;
}
