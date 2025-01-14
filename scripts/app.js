const quoteSection = document.getElementById("quote");
const userInput = document.getElementById("quote-input");
const countdownElement = document.getElementById("countdown");
const langSelect = document.getElementById("vyber-jazyk");
const generateNextBtn = document.getElementById("generate-next");
let quote = "";
let time = 60;
let timer = "";
let mistakes = 0;
let countdown = 3;
let countdownInterval;
let selectedLang = "cestina";

let quoteGenerated = false;

const getRandomQuote = () => {
  const quotes = selectedLang === "cestina" ? ceskyVety : anglickeVety;
  return quotes[Math.floor(Math.random() * quotes.length)];
};

const renderNewQuote = () => {
  if(!quoteGenerated){
    quote = getRandomQuote();
    quoteSection.textContent = quote;
    userInput.value = "";
    quoteSection.textContent = "";

    for (let i = 0; i < quote.length; i++) {
      const charSpan = document.createElement("span");
      charSpan.classList.add("quote-chars");
      charSpan.textContent = quote[i];
      quoteSection.appendChild(charSpan);
    }
  }
};

langSelect.addEventListener('change', () => {
  selectedLang = langSelect.value;
  renderNewQuote();
});

userInput.addEventListener("input", () => {
  let quoteChars = document.querySelectorAll(".quote-chars");
  quoteChars = Array.from(quoteChars);
  let userInputChars = userInput.value.split("");
  quoteChars.forEach((char, index) => {
    if (char.innerText == userInputChars[index]) {
      char.classList.add("success");
    }
    else if(userInputChars[index] == null) {
      if(char.classList.contains("success")){
        char.classList.remove("success");
      }
      else {
        char.classList.remove("fail");
      }
    }
    else {
      if(!char.classList.contains("fail")){
        mistakes++;
        char.classList.add("fail");
      }
      document.getElementById("mistakes").innerText = mistakes;
    }
    let check = quoteChars.every(element => {
      return element.classList.contains("success");
    });
    if(check) {
      displayResult();
    }
  });
});

const displayResult = () => {
  document.querySelector(".result").style.display = "block";
  clearInterval(timer);
  document.getElementById("stop-test").style.display = "none";
  userInput.disabled = true;
  let timeTaken = 1;
  if(time != 0){
    timeTaken = (60 - time) / 100;
  }
  document.getElementById("wpm").innerText = (userInput.value.length / 5 / timeTaken).toFixed(2) + " slov za minutu";
  document.getElementById("accuracy").innerText = Math.round(((userInput.value.length - mistakes) / userInput.value.length) * 100) + "%";

};

function updateTimer(){
  if(time == 0){
    displayResult();
  }
  else {
    document.getElementById("timer").innerText = --time + "s";
    }
}

function animateCountdown() {
  if (countdown > 0) {
     countdownElement.innerText = countdown;
  } else {
     countdownElement.innerText = "";
  }
  requestAnimationFrame(animateCountdown);
 } 

function updateCountdown(){
  if(countdown > 0) {
    countdownElement.innerText = countdown;
    countdown--;
  }
  else {
    countdownElement.innerText = "";
    startTest();
    clearInterval(countdownInterval);
  }
}

function startCountdown(){
  countdownInterval = setInterval(updateCountdown, 1000);
}

const timeReduce = () => {
  time = 60;
  timer = setInterval(updateTimer, 1000);
};

const startTest = () => {
  mistakes = 0;
  timer = "";
  userInput.value = "";
  userInput.disabled = false;
  userInput.focus();
  document.getElementById("start-test").style.display = "none";
  document.getElementById("stop-test").style.display = "block";
  document.getElementById("restart-test").style.display = "block";
  timeReduce();
};

const restartTest = () => {
  window.location.reload();
};

window.onload = () => {
  userInput.value = "";
  document.getElementById("start-test").style.display = "block";
  document.getElementById("stop-test").style.display = "none";
  document.getElementById("restart-test").style.display = "none";
  userInput.disabled = true;
};