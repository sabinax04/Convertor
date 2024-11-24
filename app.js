// const rubButton = document.querySelector(".money-button-1");
// const usdButton = document.querySelector(".money-button-2");
// const eurButton = document.querySelector(".money-button-3");
// const gbpButton = document.querySelector(".money-button-4");
// const buttons = document.querySelectorAll(".btn");
// const button1 = document.querySelectorAll(".btn-1");
// const leftInput = document.querySelector(".left-input");
// const rightInput = document.querySelector(".right-input");

// fetch("https://v6.exchangerate-api.com/v6/8c0c83aa088837201b15259e/latest/USD")
//   .then((response) => response.json())
//   .then((data) => {
//     let myData = data;

//     buttons.forEach((button) => {
//       button.addEventListener("click", () => {
//         buttons.forEach((btn) => {
//           btn.style.backgroundColor = "transparent";
//           btn.style.color = "#c6c6c6";
//         });

//         button.style.backgroundColor = "#833AE0";
//         button.style.color = "white";
//       });
//     });

//     button1.forEach((button) => {
//       button.addEventListener("click", () => {
//         button1.forEach((btn) => {
//           btn.style.backgroundColor = "transparent";
//           btn.style.color = "#c6c6c6";
//         });

//         button.style.backgroundColor = "#833AE0";
//         button.style.color = "white";
//       });
//     });

//     rubButton.addEventListener("click", () => {
//       leftInput.va;
//     });

//     console.log(data);
//   })
//   .catch((error) => {
//     console.log("There is some error !");
//   });

const leftButtons = document.querySelectorAll(".left-nav button");
const rightButtons = document.querySelectorAll(".right-nav button");
const leftInput = document.querySelector(".input.left-input");
const rightInput = document.querySelector(".input.right-input");

let leftCurrency = "RUB";
let rightCurrency = "USD";
let exchangeRates = {};

// Default olaraq RUB və USD seçili olsun
document.addEventListener("DOMContentLoaded", () => {
  const defaultLeftButton = document.querySelector(".left-nav .money-button-1"); // RUB düyməsi
  const defaultRightButton = document.querySelector(".right-nav .money-button-2"); // USD düyməsi

  updateButtons(leftButtons, defaultLeftButton);
  updateButtons(rightButtons, defaultRightButton);

  leftCurrency = "RUB";
  rightCurrency = "USD";
});

// Valyuta API-sindən məlumat çəkmək
fetch("https://v6.exchangerate-api.com/v6/8c0c83aa088837201b15259e/latest/USD")
  .then((response) => response.json())
  .then((data) => {
    exchangeRates = data.conversion_rates;
    console.log("Valyuta məlumatları API-dən:", exchangeRates);
  })
  .catch(() => {
    showErrorMessage("Internet yoxdur! Xahiş edirik, bağlantınızı yoxlayın.");
  });

// Sol düymələr üçün hadisə
leftButtons.forEach((button) => {
  button.addEventListener("click", () => {
    leftCurrency = button.textContent.trim();
    updateButtons(leftButtons, button);
    convertFromLeft();
  });
});

// Sağ düymələr üçün hadisə
rightButtons.forEach((button) => {
  button.addEventListener("click", () => {
    rightCurrency = button.textContent.trim();
    updateButtons(rightButtons, button);
    convertFromLeft();
  });
});

// Sol input dəyişəndə
leftInput.addEventListener("input", () => {
  validateAndFormatInput(leftInput);
  convertFromLeft(); // Sol tərəfi dəyişəndə sağ tərəfi hesablayır
});

// Sağ input dəyişəndə
rightInput.addEventListener("input", () => {
  validateAndFormatInput(rightInput);
  convertFromRight(); // Sağ tərəfi dəyişəndə sol tərəfi hesablayır
});

// Sol inputdan sağ inputa çevirmək
function convertFromLeft() {
  if (!exchangeRates[leftCurrency] || !exchangeRates[rightCurrency]) return;
  const leftValue = parseFloat(leftInput.value.replace(",", ".")) || 0;
  const rate = exchangeRates[rightCurrency] / exchangeRates[leftCurrency];
  rightInput.value = (leftValue * rate).toFixed(5).replace(".", ",");
}

// Sağ inputdan sol inputa çevirmək
function convertFromRight() {
  if (!exchangeRates[leftCurrency] || !exchangeRates[rightCurrency]) return;
  const rightValue = parseFloat(rightInput.value.replace(",", ".")) || 0;
  const rate = exchangeRates[leftCurrency] / exchangeRates[rightCurrency];
  leftInput.value = (rightValue * rate).toFixed(5).replace(".", ",");
}

// Girişlərin düzgünlüyünü yoxlamaq və formatlamaq
function validateAndFormatInput(input) {
  // Hər iki inputda yalnız bir dəfə vergül və ya nöqtə icazə verilir
  let value = input.value;
  if (value.indexOf(",") !== -1 || value.indexOf(".") !== -1) {
    const isComma = value.indexOf(",") !== -1;
    const isDot = value.indexOf(".") !== -1;

    if (isComma && isDot) {
      // Həm vergül, həm də nöqtə varsa, yalnız birini saxlayın
      value = value.replace(",", ".");
    }
  }

  // Vergülün nöqtəyə çevrilməsi
  value = value.replace(",", ".");

  // Nöqtədən sonra maksimum 5 rəqəm
  const parts = value.split(".");
  if (parts[1] && parts[1].length > 5) {
    parts[1] = parts[1].slice(0, 5);
    value = parts.join(".");
  }

  // Hərflər və boşluqların silinməsi
  value = value.replace(/[^0-9.]/g, "");

  input.value = value;

  // Həm sol, həm də sağ inputları nöqtəyə çevirir
  if (input === leftInput) {
    rightInput.value = rightInput.value.replace(",", ".");
    leftInput.value = leftInput.value.replace(",", ".");
  } 
}

// Aktiv düyməni seçmək
function updateButtons(buttons, activeButton) {
  buttons.forEach((btn) => {
    btn.style.backgroundColor = "transparent";
    btn.style.color = "#c6c6c6";
  });
  activeButton.style.backgroundColor = "#833AE0";
  activeButton.style.color = "white";
}

// // İnternet xətası mesajını göstərin
// function showErrorMessage(message) {
//   const errorOverlay = document.createElement("div");
//   errorOverlay.style.position = "fixed";
//   errorOverlay.style.top = "0";
//   errorOverlay.style.left = "0";
//   errorOverlay.style.width = "100%";
//   errorOverlay.style.height = "100%";
//   errorOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
//   errorOverlay.style.display = "flex";
//   errorOverlay.style.justifyContent = "center";
//   errorOverlay.style.alignItems = "center";
//   errorOverlay.style.color = "white";
//   errorOverlay.style.fontSize = "24px";
//   errorOverlay.style.zIndex = "1000";
//   errorOverlay.textContent = message;

//   document.body.appendChild(errorOverlay);
// }
