const leftButtons = document.querySelectorAll(".left-nav button");
const rightButtons = document.querySelectorAll(".right-nav button");
const leftInput = document.querySelector(".input.left-input");
const rightInput = document.querySelector(".input.right-input");
const leftText = document.querySelector(".convertor-1");
const rightText = document.querySelector(".convertor-2");
const errorMessage = document.querySelector(".error-message");

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
    errorMessage.textContent = "";
  })
  .catch(() => {
    showErrorMessage("İnternet yoxdur! Xahiş edirik, bağlantınızı yoxlayın.");
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
  leftInput.value = removeLeadingZeros(leftInput.value);
  validateAndFormatInput(leftInput);
  convertFromLeft();
});

rightInput.addEventListener("input", () => {
  rightInput.value = removeLeadingZeros(rightInput.value);
  validateAndFormatInput(rightInput);
  convertFromRight();
});

function convertFromLeft() {
  if (!exchangeRates[leftCurrency] || !exchangeRates[rightCurrency]) return;
  const leftValue = parseFloat(leftInput.value) || 0;
  const rate = exchangeRates[rightCurrency] / exchangeRates[leftCurrency];
  rightInput.value = (leftValue * rate).toFixed(5);
}

function convertFromRight() {
  if (!exchangeRates[leftCurrency] || !exchangeRates[rightCurrency]) return;
  const rightValue = parseFloat(rightInput.value) || 0;
  const rate = exchangeRates[leftCurrency] / exchangeRates[rightCurrency];
  leftInput.value = (rightValue * rate).toFixed(5);
}

function validateAndFormatInput(input) {
  let value = input.value;

  value = value.replace(",", ".").replace(/[^0-9.]/g, "");
  value = value.replace(/^(\d*\.\d*).*$/, "$1");
  const parts = value.split(".");

  if (parts.length > 2) {
    value = parts[0] + "." + parts[1];
  }

  if (parts[1] && parts[1].length > 5) {
    parts[1] = parts[1].slice(0, 5);
  }

  input.value = parts.join(".");
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
  errorMessage.textContent = message;
}

function removeLeadingZeros(value) {
  value = value.replace(/^0+/, "0");
  if (value.startsWith("0") && value[1] !== "." && value.length > 1) {
    value = value.substring(1);
  }
  return value;
}
