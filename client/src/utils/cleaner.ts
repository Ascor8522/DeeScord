import { C_Mention } from "../components/c_mention";
import { Client } from "../controller/client";
import { User } from "../interfaces/user";

/**
 * Cleans and parses text to avoid html/javascript injection
 * @param {string} input the messageto clean
 */
export function clean(input: string): string {
	input = input.trim();

	input = replaceAll(input, /&(?!amp;)/g, "&amp;");
	input = replaceAll(input, /\</g, "&lt;");
	input = replaceAll(input, /\>/g, "&gt;");
	input = replaceAll(input, /\"/g, "&quot;");
	input = replaceAll(input, /\'/g, "&apos;");
	input = replaceAll(input, /\t/g, "&emsp;");

	return input;
}

export function format(input: string): string {
	input = replaceAll(input, /```(?:[\n]|<br>)*((?:[\n]|.)*)(?:[\n]|<br>)*```/g, "<code>$1</code>");
	input = replaceAll(input, /\n/g, "<br>");
	input = replaceAll(input, /`(?:[\n]|<br>)*((?:[\n]|.)*)(?:[\n]|<br>)*`/g, "<pre>$1</pre>");
	input = replaceAll(input, /\*\*(.+)\*\*/g, "<b>$1</b>");
	input = replaceAll(input, /\*(.+)\*/g, "<i>$1</i>");
	input = replaceAll(input, /\_\_(.+)\_\_/g, "<u>$1</u>");
	input = replaceAll(input, /\~\~(.+)\~\~/g, "<s>$1</s>");
	input = replaceURL(input, /[a-z][a-z0-9+.-]*:\/\/(?:(?:[a-z0-9][-a-z0-9@:%._\+~#=]*\.[a-z]{2,6})|(?:[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})|(?:[a-z0-9]))(?:[-a-z0-9@:%_\+.~#?&/=()]*)?/gi);
	input = replaceAll(input, /^\/shrug(?:$| ((?:.|\n)*))/g, "$1 ¯\\_(ツ)_/¯");
	input = replaceAll(input, /^\/tableflip(?:$| ((?:.|\n)*))/g, "$1 (╯°□°）╯︵ ┻━┻");
	input = replaceAll(input, /^\/unflip(?:$| ((?:.|\n)*))/g, "$1 ┬─┬ ノ( ゜-゜ノ)");
	input = replaceAll(input, /^\/me(?:$| ((?:.|\n)*))/g, "<i>$1</i>");

	return input;
}

export function replaceTagsNamesToIds(input: string, client: Client): string {
	return replaceAll(input, /\@([a-zA-Z0-9])/g, (match: string, p1: string): string => { // TODO
		const mention: User | undefined = client.getUsers.find((user: User) => user.getUserName === p1);
		if (mention) {
			return `<@${mention.getUserId.toString()}>`;
		} else {
			return match;
		}
	});
}

export function replaceTagsIdsToNames(input: string, client: Client): string {
	return replaceAll(input, /&lt;@(.+)&gt;/g, (match: string, p1: string): string => {
		if (p1 === "everyone") {
			return new C_Mention("everyone", client).outerHTML;
		}

		const mention: User | undefined = client.getUsers.find((user: User) => user.getUserId.toString() === p1);

		return mention ? new C_Mention(mention, client).outerHTML : match;
	});
}

/**
 * Replaces all patterns
 * @param {string} input the message to replace
 * @param {RegExp} before the regex of what to remaplce
 * @param {string} after the string as replacement
 */
function replaceAll(input: string, before: RegExp, after: string | ((match: string, p1: string) => string)): string {
	let i = 0;
	while (before.test(input)) {
		input = typeof after === "string" ? input.replace(before, after) : input.replace(before, after);
		i++;
		if (i < 20) {
			console.error("replace loop");
			console.error(input);
			console.error(after);
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
