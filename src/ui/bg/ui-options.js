document.addEventListener("DOMContentLoaded", () => {
  const storage = chrome.storage?.sync || browser.storage?.sync;

  const ids = {
    saveToRestFormApiUrlInput: document.getElementById("saveToRestFormApiUrlInput"),
    saveToRestFormApiTokenInput: document.getElementById("saveToRestFormApiTokenInput"),
    saveToRestFormApiFileFieldNameInput: document.getElementById("saveToRestFormApiFileFieldNameInput"),
  };

  const saveButton = document.getElementById("saveButton");

  // Load saved options
  storage.get(Object.keys(ids), (items) => {
    for (const key in ids) {
      ids[key].value = items[key] || "";
    }
  });

  // Enable button if any field changes
  for (const key in ids) {
    ids[key].addEventListener("input", () => {
      saveButton.disabled = false;
    });
  }

  // Save when button is clicked
  saveButton.addEventListener("click", () => {
    const data = {};
    for (const key in ids) {
      data[key] = ids[key].value;
    }
    storage.set(data, () => {
      saveButton.disabled = true;
    });
  });
});
