const url = "*://chat.google.com/u/0/_/DynamiteWebUi/data/batchexecute*";
const termsPath = chrome.runtime.getURL("./terms.json");
const typingCode = "xok6wd";
const enterCode = "RTBQkb";

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

  if (rawInput.includes(enterCode)) {
    const [[[__, userMessage]]] = JSON.parse(rawInput);
    const [_, message ]  = JSON.parse(userMessage);

    handleSendMessage(message);
  }
  
  if(rawInput.includes(typingCode)) {
    const [[[_, userMessage]]] = JSON.parse(rawInput);
    const [ message ]  = JSON.parse(userMessage);

    handleSendMessage(message);
  }

  },
  {urls: [url]},
  ['requestBody']
);

function handleSendMessage(message) {
  chrome.storage.local.get("terms", ({ terms }) => {
    terms.forEach(({ explicacao: explanation, sugestoes: suggestion, termos: term }) => {
      term.split(",").forEach((trm) => {
        
        let test = `/\b ${trm} \b/g`;
        let re = new RegExp(test);

        console.log({ message })

        console.log({ re })

        if (message.toLowerCase().match(re)) {
          console.log('deu match')
          chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {

            let payload = { trm, explanation, suggestion };

            chrome.tabs.sendMessage(tabs[0].id, payload);
          });
          return;
        }
      });
    })
  });
}
