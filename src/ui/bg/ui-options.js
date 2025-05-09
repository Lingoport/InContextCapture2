// Minimal ui-options.js for RestFormApi settings only
document.addEventListener("DOMContentLoaded", () => {
  const storage = chrome.storage?.sync || browser.storage?.sync;

  const ids = {
    saveToRestFormApiInput: document.getElementById("saveToRestFormApiInput"),
    saveToRestFormApiUrlInput: document.getElementById("saveToRestFormApiUrlInput"),
    saveToRestFormApiTokenInput: document.getElementById("saveToRestFormApiTokenInput"),
    saveToRestFormApiFileFieldNameInput: document.getElementById("saveToRestFormApiFileFieldNameInput"),
    saveToRestFormApiUrlFieldNameInput: document.getElementById("saveToRestFormApiUrlFieldNameInput"),
  };

  // Load saved options
  storage.get(Object.keys(ids), (items) => {
    for (const key in ids) {
      if (ids[key].type === "radio") {
        ids[key].checked = items[key] || false;
      } else {
        ids[key].value = items[key] || "";
      }
    }
  });

  // Save changes
  for (const key in ids) {
    ids[key].addEventListener("change", () => {
      const value = ids[key].type === "radio" ? ids[key].checked : ids[key].value;
      storage.set({ [key]: value });
    });
  }
});
