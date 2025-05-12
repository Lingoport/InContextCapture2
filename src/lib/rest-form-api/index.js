export class RestFormApi {
	constructor(token, restApiUrl, fileFieldName, urlFieldName) {
		this.controller = new AbortController(); // move here if needed
		this.token = token;
		this.restApiUrl = restApiUrl;
		this.fileFieldName = fileFieldName;
		this.urlFieldName = urlFieldName;
	}

	async upload(token, content, restApiUrl,fileFieldName) {
		const storage = chrome.storage?.sync || browser.storage?.sync;
		// Load saved options


		const serverURL = restApiUrl//"https://fs-incontext.lingoport.io/incontext-server/";
		const email = fileFieldName//"dev@lingoport.com";
		const serverToken = token//"8T7Dg1Bp7Jj561SfABxI4U0lu3SSVMGT";

		storage.get(["saveToRestFormApiUrlInput", "saveToRestFormApiTokenInput", "saveToRestFormApiFileFieldNameInput"], (items) => {
			serverURL = items.saveToRestFormApiUrlInput || "";
			email = items.saveToRestFormApiTokenInput || "";
			serverToken = items.saveToRestFormApiFileFieldNameInput || "";
		});


		console.log("Upload endpoint:", restApiUrl);
		console.log("Upload email:", email);
		console.log(serverToken);

		const blob = content instanceof Blob ? content : new Blob([content], { type: "text/html" });

		const formData = new FormData();
		formData.append("theFile", blob, "InContext.html");
		formData.append("theToken", serverToken);
		formData.append("theEmail", email);

		for (let [key, val] of formData.entries()) {
			console.log("FormData entry:", key, val);
		}
		const uploadUrl = serverURL.endsWith("/") ? serverURL + "document/upload" : serverURL + "/document/upload";
		console.log("Upload uploadUrl:", uploadUrl);

		const response = await fetch(uploadUrl, {
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
