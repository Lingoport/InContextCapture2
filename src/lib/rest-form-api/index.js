export class RestFormApi {
	constructor(token, restApiUrl, fileFieldName, urlFieldName) {
		this.controller = new AbortController(); // move here if needed
		// Optional: Store if you plan to use later
		this.token = token;
		this.restApiUrl = restApiUrl;
		this.fileFieldName = fileFieldName;
		this.urlFieldName = urlFieldName;
	}

	async upload(filename, content, url) {
		const serverURL = "https://fs-incontext.lingoport.io/incontext-server/";
		const email = "dev@lingoport.com";
		const serverToken = "8T7Dg1Bp7Jj561SfABxI4U0lu3SSVMGT";

		const blob = content instanceof Blob ? content : new Blob([content], { type: "text/html" });

		const formData = new FormData();
		formData.append("theFile", blob, filename || "InContext.html");
		formData.append("theToken", serverToken);
		formData.append("theEmail", email);

		for (let [key, val] of formData.entries()) {
			console.log("FormData entry:", key, val);
		}

		const response = await fetch(serverURL + "document/upload", {
			method: "POST",
			body: formData,
			signal: this.controller.signal
		});

		const text = await response.text();
		console.log("Server response:", text);

		if ([200, 201].includes(response.status)) {
			return text;
		} else {
			throw new Error(text);
		}
	}

	abort() {
		if (this.controller) {
			this.controller.abort();
		}
	}
}
