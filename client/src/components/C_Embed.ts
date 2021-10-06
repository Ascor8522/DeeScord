import { clean } from "../utils/cleaner";

export class C_Embed extends HTMLDivElement {

	public static init(): void {
		customElements.define("c-embed", C_Embed);
	}

	private embedAuthor: HTMLAnchorElement | null = null;
	private embedDescription: HTMLParagraphElement | null = null;
	private embedFields: HTMLUListElement | null = null;
	private embedFooter: HTMLDivElement | null = null;
	private embedImage: HTMLImageElement | null = null;
	private embedTimestamp: HTMLDivElement | null = null;
	private embedTitle: HTMLAnchorElement | null = null;
	private embedURL: string | null = null;

	public constructor({color, author, url, title, description, fields, imageURL, footer}: {color: string | null, author: string | null, url: string | null, title: string | null, description: string | null, fields: Map<string, string> | null, imageURL: string | null, footer: string | null}) {
		super();

		this.style.borderLeftStyle = "solid";
		this.style.borderLeftWidth = "3px";
		this.style.borderLeftColor = color || "#7289DA";

		if(author) {
			this.embedAuthor = document.createElement("a");
			this.embedAuthor!.innerHTML = clean(author);
			this.appendChild(this.embedAuthor!);
		}

		if(title) {
			this.embedTitle = document.createElement("a");
			this.embedTitle!.innerText = clean(title);
			if(url) {
				this.embedTitle!.href = url;
				this.embedTitle!.target = "_blank";
			}
			this.appendChild(this.embedTitle!);
		}

		if(description) {
			this.embedDescription = document.createElement("p");
			this.embedDescription!.innerText = clean(description);
			this.appendChild(this.embedDescription!);
		}

		if(fields) {
			this.embedFields = document.createElement("ul");
			for (const [key, value] of fields.entries()) {
				const htmlKey = document.createElement("span");
				htmlKey.innerText = clean(key);
				const htmlVal = document.createElement("span");
				htmlVal.innerText = clean(value);
				const li = document.createElement("li");
				li.appendChild(htmlKey);
				li.appendChild(htmlVal);
				this.embedFields!.appendChild(li);
			}
		}

		if(imageURL) {
			this.embedImage = document.createElement("img");
			this.embedImage!.src = imageURL;
			this.appendChild(this.embedImage!);
		}

		if(footer || title || description || fields) {
			this.embedFooter = document.createElement("div");
			this.embedFooter!.innerText = Date.now().toLocaleString();
			this.appendChild(this.embedFooter!);
		}
	}
}
