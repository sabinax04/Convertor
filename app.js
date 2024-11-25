const leftButtons = document.querySelectorAll(".left-nav button");
const rightButtons = document.querySelectorAll(".right-nav button");
const leftInput = document.querySelector(".input.left-input");
const rightInput = document.querySelector(".input.right-input");
const leftText = document.querySelector(".convertor-1");
const rightText = document.querySelector(".convertor-2");

let leftCurrency = "RUB";
let rightCurrency = "USD";
let exchangeRates = {};

document.addEventListener("DOMContentLoaded", () => {
  const defaultLeftButton = document.querySelector(".left-nav .money-button-1");
  const defaultRightButton = document.querySelector(
    ".right-nav .money-button-2"
  );

  updateButtons(leftButtons, defaultLeftButton);
  updateButtons(rightButtons, defaultRightButton);

  leftCurrency = "RUB";
  rightCurrency = "USD";

  updateConversionTexts();
});

fetch("https://v6.exchangerate-api.com/v6/8c0c83aa088837201b15259e/latest/USD")
  .then((response) => response.json())
  .then((data) => {
    exchangeRates = data.conversion_rates;
    console.log("Valyuta məlumatları API-dən:", exchangeRates);
    updateConversionTexts();
  })
  .catch(() => {
    showErrorMessage("Internet yoxdur! Xahiş edirik, bağlantınızı yoxlayın.");
  });

leftButtons.forEach((button) => {
  button.addEventListener("click", () => {
    leftCurrency = button.textContent.trim();
    updateButtons(leftButtons, button);
    updateConversionTexts();
    convertFromLeft();
  });
});

rightButtons.forEach((button) => {
  button.addEventListener("click", () => {
    rightCurrency = button.textContent.trim();
    updateButtons(rightButtons, button);
    updateConversionTexts();
    convertFromLeft();
  });
});

leftInput.addEventListener("input", () => {
  validateAndFormatInput(leftInput);
  convertFromLeft();
});

rightInput.addEventListener("input", () => {
  validateAndFormatInput(rightInput);
  convertFromRight();
});

function convertFromLeft() {
  if (!exchangeRates[leftCurrency] || !exchangeRates[rightCurrency]) return;
  const leftValue = parseFloat(leftInput.value.replace(",", ".")) || 0;
  const rate = exchangeRates[rightCurrency] / exchangeRates[leftCurrency];
  rightInput.value = (leftValue * rate).toFixed(5).replace(".", ",");
}

function convertFromRight() {
  if (!exchangeRates[leftCurrency] || !exchangeRates[rightCurrency]) return;
  const rightValue = parseFloat(rightInput.value.replace(",", ".")) || 0;
  const rate = exchangeRates[leftCurrency] / exchangeRates[rightCurrency];
  leftInput.value = (rightValue * rate).toFixed(5).replace(".", ",");
}

function validateAndFormatInput(input) {
  let value = input.value.replace(",", ".");
  value = value.replace(/[^0-9.]/g, "");

  const parts = value.split(".");
  if (parts[1] && parts[1].length > 5) {
    parts[1] = parts[1].slice(0, 5);
  }
  input.value = parts.join(".").replace(".", ",");
}

function updateConversionTexts() {
  if (!exchangeRates[leftCurrency] || !exchangeRates[rightCurrency]) return;
  const rate = exchangeRates[rightCurrency] / exchangeRates[leftCurrency];
  leftText.textContent = `1 ${leftCurrency} = ${rate.toFixed(
    5
  )} ${rightCurrency}`;
  rightText.textContent = `1 ${rightCurrency} = ${(1 / rate).toFixed(
    5
  )} ${leftCurrency}`;
}

function updateButtons(buttons, activeButton) {
  buttons.forEach((btn) => {
    btn.style.backgroundColor = "transparent";
    btn.style.color = "#c6c6c6";
  });
  activeButton.style.backgroundColor = "#833AE0";
  activeButton.style.color = "white";
}

document.addEventListener("DOMContentLoaded", () => {
  const icon = document.querySelector(".iconn");
  const texts = document.querySelector(".texts");

  icon.addEventListener("click", () => {
    texts.classList.toggle("show");
  });
});

function showErrorMessage(message) {
  alert(message);
}
