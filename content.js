chrome.runtime.onMessage.addListener((payload, sender, resp) => {

  //.possible map element.
  const chatArea = document.querySelector(".AO");

  chatArea.childNodes.forEach((node) => {
    if (node.classList.contains("DiversityExtensionPopUp")) {
      chatArea.removeChild(node);
    }
  });

  const popUp = createPopUp(payload, chatArea);
  
  chatArea.appendChild(popUp);

  const handleClearPopUp = ({ key }) => {
    console.log('esc clicked down');
    if (key === "Escape" && popUp) {
      clearPopUp(popUp, handleClearPopUp);
    }
  }

  document.addEventListener('keydown', handleClearPopUp);

  animatePopUp(popUp);

  clearAnimatePopUp(popUp);

});


const createPopUp = ({ explanation, suggestion, trm }, chatArea) => {
  const popUp = document.createElement("div");
  
  popUp.classList.add("DiversityExtensionPopUp");
  popUp.style.background = "#ff9966";
  popUp.style.fontSize = "20px";
  popUp.style.display = "block";
  popUp.style.padding = "15px";
  popUp.style.paddingTop = "3px";
  popUp.style.boxSizing = "border-box";
  popUp.style.wordBreak = "break-word";
  popUp.style.opacity = ".8";
  popUp.style.width = "350px";
  popUp.style.height = "fit-content";
  popUp.style.position = "absolute";
  popUp.style.bottom = "150px";
  popUp.innerHTML = `<button>X</button>`;
  popUp.innerHTML += `<h2>\u26A0\uFE0F  ${toTitleCase(trm)}</h2>
  <p>${explanation} Que tal utilizar <strong>${toTitleCase(suggestion)}</strong> no lugar?</p>`;

  createCloseButton(popUp, chatArea);

  return popUp;
}

const clearPopUp = (popUp, handleClearPopUp) => {
  popUp.style.display = "none";
  if (popUp && popUp.parentNode) {
    popUp.parentNode.removeChild(popUp);
  }
  popUp = null;

  document.removeEventListener('keydown', handleClearPopUp);
}

const createCloseButton = (popUp, chatArea) => {

  const closeButton = popUp.childNodes[0];

  closeButton.addEventListener("click", () => {
    popUp.style.display = "none";
    chatArea.removeChild(popUp)
  });

  closeButton.addEventListener("mouseover", () => {
      closeButton.style.opacity = "1";
      closeButton.style.transition = "transform .7s ease-in-out";
      closeButton.style.transform = "rotate(359deg)";
  });
    
  closeButton.addEventListener("mouseleave", () => {
      closeButton.style.opacity = "0.5";
      closeButton.style.transform = "rotate(0)";
  });

  closeButton.style.width = "32px";
  closeButton.style.height = "32px";
  closeButton.style.position = "absolute";
  closeButton.style.right = "32px";
  closeButton.style.top = "32px";
  closeButton.style.opacity = "0.5";

}

const animatePopUp = (popUp) => {
  let id = null;
  let pos = 0;
  clearInterval(id);
  id = setInterval(frame, 3);
  function frame() {
    if (pos == 200) {
      clearInterval(id);
    } else {
      pos++;
      popUp.style.right = pos + 'px';
    }
  }
}

const clearAnimatePopUp = (popUp) => {
  setTimeout(() => {
    let id = null;
    let pos = 200;
    clearInterval(id);
    id = setInterval(frame, 3);
    function frame() {
      if (pos == 0) {
        clearInterval(id);
        popUp.style.display = "none";
      } else {
        pos--;
        popUp.style.right = pos + 'px';
      }
    }
  }, 15_000);
}

const toTitleCase = str => str.replace(/(^\w|\s\w)/g, m => m.toUpperCase());
