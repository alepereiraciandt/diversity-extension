const url = "*://chat.google.com/u/0/_/DynamiteWebUi/data/batchexecute*";
const termsPath = chrome.runtime.getURL("./terms.json");
const typingCode = "xok6wd";

chrome.runtime.onInstalled.addListener(async () => {
    try {
      const data = await fetch(termsPath);
      const terms = await data.json();
      chrome.storage.local.set({ terms });
    } catch (error) {
      console.log(error.message);
    }
});

chrome.webRequest.onBeforeRequest.addListener((details) =>{
  const rawInput = details.requestBody.formData["f.req"][0];

  if (rawInput.includes(typingCode)) {
    const [[[_, userMessage]]] = JSON.parse(rawInput);
    const [ message ]  = JSON.parse(userMessage);

    chrome.storage.local.get("terms", ({ terms }) => {
      terms.forEach(({ explicacao: explanation, sugestoes: suggestion, termos: term }) => {
        term.split(",").forEach((trm) => {
            if (message.toLowerCase().includes(trm)) {
              chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {

                let payload = { trm, explanation, suggestion };

                chrome.tabs.sendMessage(tabs[0].id, payload);
              });
            }
        });
      })
    });
  }

  },
  {urls: [url]},
  ['requestBody']
);
