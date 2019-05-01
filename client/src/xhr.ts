/**
 * Creates an xmlhttprequest
 * @param {string} method the method to use for the request (GET|POST|PUT)
 * @param {string} url the url to make the request to
 * @param {string} params the parameters for the request
 * @param {object} headers the headers for the request
 * @returns a promise with the request result as a string
 */
export function xhr(method: "GET" | "POST" | "PUT", host: string, url: string, params: string | object = {}, headers: object = {}): Promise<string> {
	return new Promise<string>((resolve, reject): void => {
		const request = new XMLHttpRequest();
		request.open(method, url);
		request.onload = function(this) {
			if (this.status >= 200 && this.status < 300) {
				resolve(request.response);
			} else {
				console.error(`Error loading ${host + url}\n${request.statusText}`);
				reject();
			}
		};
		request.onerror = () => {
			console.error(`Error loading ${host + url}\n${request.statusText}`);
			reject();
		};
		if (headers) {
			Object.keys(headers).forEach((key) => {
				// @ts-ignore
				request.setRequestHeader(key, headers[key]);
			});
		}
		if (typeof params === "object") {
			params = Object.keys(params).map((key) => {
				// @ts-ignore
				return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
			}).join("&");
		}
		request.send();
	});
}
