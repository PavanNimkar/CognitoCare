// API configration
const API_KEY = "";
const API_URL = "";

// accesing elements form DOM
const typingForm = document.querySelector(".typing-form");
const chatList = document.querySelector(".chat-list");
const menuBar = document.querySelector("#menu");
const sideBarContainer = document.querySelector(".side-bar");
const main = document.querySelector("main");
const typingArea = document.querySelector(".typing-area");
const toggleBtn = document.querySelector(".fa-sun");
const bodyElement = document.querySelector("body");
const iconNodeList = document.querySelectorAll(".icon");
const iconArray = Array.from(iconNodeList);
const deleteButton = document.querySelector(".fa-trash");
const suggestionsArray = Array.from(document.querySelectorAll(".suggestion"));
const header = document.querySelector("header");
const copyIcon = null;
const textElement = null;
const resetModeBtn = document.querySelector("#reset-mode");
const addBtn = document.querySelector("#add");
const typingInput = document.querySelector(".typing-input");
const historyContainer = document.querySelector(".history-container");
const suggestion = document.querySelector("#first");

const showTypingEffect = (text, textElement) => {
  const words = text.split(" ");
  currentIndex = 0;
  const typingInterval = setInterval(() => {
    textElement.innerText +=
      (currentIndex === 0 ? "" : " ") + words[currentIndex++];

    if (currentIndex === words.length) {
      clearInterval(typingInterval);
    }
  }, 75);
};

const generateAPIResponse = async (incomingMessageDiv) => {
  let textElement = incomingMessageDiv.querySelector(".text");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: userMessage }],
          },
        ],
      }),
    });
    const data = await response.json();
    let apiResponse = data?.candidates[0].content.parts[0].text;
    showTypingEffect(apiResponse, textElement);
  } catch (error) {
    console.log(error);
  } finally {
    incomingMessageDiv.classList.remove("loading");
  }
};

const reset = () => {
  sideBarContainer.style.display = "none";
  main.style.display = "block";
  suggestion.style.display = "none";
  main.style.width = "100vw";
  main.style.height = "100vh";
  main.style.marginLeft = "auto";
  typingArea.style.width = "100%";
  typingArea.style.margin = "auto";
};

const createMessageElement = (content, ...className) => {
  const div = document.createElement("div");
  div.classList.add("message", ...className);
  div.innerHTML = content;
  return div;
};

const copyMessage = (copyIcon) => {
  let message = copyIcon.parentElement.querySelector(".text").innerText;
  navigator.clipboard.writeText(message);
  console.log("before" + copyIcon.classList);
  copyIcon.classList.remove("fa-regular", "fa-copy");
  copyIcon.classList.add("fa-solid", "fa-check");

  setTimeout(() => {
    console.log("in set time ");
    copyIcon.classList.remove("fa-solid", "fa-check");
    copyIcon.classList.add("fa-regular", "fa-copy");
    console.log(copyIcon.classList);
  }, 1000);
};

const showLoadingAnimation = () => {
  const html = `
        <div class="message-content">
          <img src="https://www.shutterstock.com/image-vector/mental-health-line-icon-positive-600nw-2035121135.jpg" alt="Gemini Image" class="avatar" />
          <p class="text"></p>
          <div class="loading-indicator">
            <div class="loading-bar"></div>
            <div class="loading-bar"></div>
            <div class="loading-bar"></div>
          </div>
        </div>
        <i onclick="copyMessage(this)" class="icon fa-regular fa-copy"></i>
      `;
  let incomingMessageDiv = createMessageElement(html, "incoming", "loading");
  chatList.appendChild(incomingMessageDiv);

  generateAPIResponse(incomingMessageDiv);
};

const handleOutGoingChat = () => {
  userMessage =
    typingForm.querySelector(".typing-input").value.trim() || userMessage;
  if (!userMessage) return;
  const html = `<div class="message-content">
          <img src="images/user.jpg" alt="User Avatar" class="avatar" />
          <p class="text">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. At,
            consequatur, vitae perspiciatis nostrum tenetur eius.
          </p>
        </div>`;

  let outgoingMessageDiv = createMessageElement(html, "outgoing");
  outgoingMessageDiv.querySelector(".text").innerHTML = userMessage;
  if (userMessage) {
    pElement = document.createElement("p");
    pElement.innerText = userMessage;
    pElement.classList.add("history-para");
    historyContainer.appendChild(pElement);

    pElement.addEventListener("click", () => {
      typingInput.value = pElement.innerText;
    });
  }
  chatList.appendChild(outgoingMessageDiv);
  typingForm.reset();
  setTimeout(showLoadingAnimation, 500);
};

suggestionsArray.forEach((suggestion) => {
  suggestion.addEventListener("click", () => {
    header.style.display = "none";
    console.log("clicked suggestion");
    userMessage = suggestion.querySelector(".text").innerText;
    handleOutGoingChat();
  });
});

toggleBtn.addEventListener("click", () => {
  bodyElement.classList.toggle("light_mode");
  iconArray.forEach((element) => {
    element.classList.toggle("light_mode");
  });
  // iconArray[5].classList.toggle("fa-moon");
});

deleteButton.addEventListener("click", () => {
  if (confirm("Are you sure to delete all chats?")) {
    header.style.display = "block";
    let outgoingMessageArray = Array.from(
      document.querySelectorAll(".outgoing")
    );
    outgoingMessageArray.forEach((outGoingMessage) => {
      outGoingMessage.style.display = "none";
    });

    let incomingArray = Array.from(document.querySelectorAll(".incoming"));
    incomingArray.forEach((incomingMessage) => {
      incomingMessage.style.display = "none";
    });
  }
});

addBtn.addEventListener("click", () => {
  if (confirm("Are you sure to open new chats")) {
    header.style.display = "block";
    let outgoingMessageArray = Array.from(
      document.querySelectorAll(".outgoing")
    );
    outgoingMessageArray.forEach((outGoingMessage) => {
      outGoingMessage.style.display = "none";
    });

    let incomingArray = Array.from(document.querySelectorAll(".incoming"));
    incomingArray.forEach((incomingMessage) => {
      incomingMessage.style.display = "none";
    });
  }
});

typingForm.addEventListener("submit", (e) => {
  e.preventDefault();
  header.style.display = "none";
  handleOutGoingChat();
});

menuBar.addEventListener("click", () => {
  reset();
});

const toggleMenu = () => {
  sideBarContainer.style.display = "block";
  main.style.width = "79vw";
  main.style.height = "100vh";
  main.style.marginLeft = "14rem";
  typingArea.style.width = "80%";

  // typingArea.style.margin = "0 2rem";
};

resetModeBtn.addEventListener("click", toggleMenu);
