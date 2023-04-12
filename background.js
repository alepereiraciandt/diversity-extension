const url = "*://chat.google.com/u/0/_/DynamiteWebUi/data/batchexecute*";
const termsPath = chrome.runtime.getURL("./terms.json");
const typingCode = "xok6wd";
const enterCode = "RTBQkb";

let TERMS_MAP;
let memoLength;

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

    if (memoLength != message.length) {
      handleSendMessage(message);
    }
    memoLength = message.length;
  }

  },
  {urls: [url]},
  ['requestBody']
);

async function getTerms() {
  try {
    if (!TERMS_MAP) {
    const data = await fetch(termsPath);
    const terms = await data.json();
    const mapTerm = new Map();

      terms.forEach((term) => {
        let keyTerm = term.termos.split(",");

        keyTerm.forEach((key) => mapTerm.set(key, [term.explicacao, term.sugestoes]))
      });

      TERMS_MAP = mapTerm;
    }
    return TERMS_MAP;
  } catch (error) {
    console.log(error.message);
  }
}

async function handleSendMessage(message) {

  const term = await getTerms();

  const arrayMsg = message.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);

  arrayMsg.forEach((msg) => {
    if (term.has(msg)) {
      showPopUp(msg, term.get(msg));
    }
  });
}

function showPopUp(trm, data) {
  const [explanation, suggestion] = data;

    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {

      let payload = { trm, explanation, suggestion };

      chrome.tabs.sendMessage(tabs[0].id, payload);
  });
}
