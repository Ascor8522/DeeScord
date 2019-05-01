/**
 * Retrieves the cookies from the browser
 * @param {string} name the nbame of the cookie to retrieve
 * @returns the value of the cookie
 */
export function getCookie(name: string): string {
	const cookieName = name + "=";
	const cookiesString = decodeURIComponent(document.cookie);
	const cookies = cookiesString.split(";");

	for (let cookie of cookies) {
		while (cookie.charAt(0) === " ") {
			cookie = cookie.substring(1);
		}
		if (cookie.indexOf(cookieName) === 0) {
			return cookie.substring(cookieName.length, cookie.length);
		}
	}
	return "";
}
