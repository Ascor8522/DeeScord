/**
 * Cleans and parses text to avoid html/javascript injection
 * @param {string} input the messageto clean
 */
export function clean(input: string): string {
	input = input.trim();

	input = replaceAll(input, /\&/g, "&amp;");
	input = replaceAll(input, /\</g, "&lt;");
	input = replaceAll(input, /\>/g, "&gt;");
	input = replaceAll(input, /\"/g, "&quot;");
	input = replaceAll(input, /\'/g, "&apos;");
	input = replaceAll(input, /\t/g, "&emsp;");

	return input;
}

export function format(input: string): string {
	input = replaceAll(input, /\`\`\`[\n]{0,}(.+)[\n]{0,}\`\`\`/g, "<code>$1</code>");
	input = replaceAll(input, /\n/g, "<br>");
	input = replaceAll(input, /\`(.+)\`/g, "<pre>$1</pre>");
	// input = replaceAll(input, /\*\*\*(.+)\*\*\*/g, "<b><i>$1</i></b>");
	input = replaceAll(input, /\*\*(.+)\*\*/g, "<b>$1</b>");
	input = replaceAll(input, /\*(.+)\*/g, "<i>$1</i>");
	input = replaceAll(input, /\_\_(.+)\_\_/g, "<u>$1</u>");
	input = replaceAll(input, /\~\~(.+)\~\~/g, "<s>$1</s>");
	input = replaceURL(input, /[a-z][a-z0-9+.-]*:\/\/(?:(?:[a-z0-9][-a-z0-9@:%._\+~#=]*\.[a-z]{2,6})|(?:[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})|(?:[a-z0-9]))(?:[-a-z0-9@:%_\+.~#?&/=()]*)?/gi);
	input = replaceAll(input, /\/shrug (.+)/g, "$1 ¯\\_(ツ)_/¯");

	return input;
}

/**
 * Replaces all patterns
 * @param {string} input the message to replace
 * @param {RegExp} before the regex of what to remaplce
 * @param {string} after the string as replacement
 */
function replaceAll(input: string, before: RegExp, after: string): string {
	while (before.test(input)) {
		input = input.replace(before, after);
	}
	return input;
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
