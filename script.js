// ===== CERCA =====
const patternInput = document.querySelector("#pattern");
const flagG = document.querySelector("#flag-g");
const flagI = document.querySelector("#flag-i");
const textInput = document.querySelector("#text");
const errorEl = document.querySelector("#error");
const countEl = document.querySelector("#count");
const resultEl = document.querySelector("#result");

// Evita che il testo dell'utente venga letto come HTML
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function search() {
  const pattern = patternInput.value;
  const text = textInput.value;
  errorEl.textContent = "";

  if (pattern === "") {
    countEl.textContent = "0 risultati";
    resultEl.innerHTML = escapeHtml(text);
    return;
  }

  // Creiamo la regex (se è scritta male, mostriamo l'errore)
  let regex;
  try {
    regex = new RegExp(pattern, flagI.checked ? "gi" : "g");
  } catch (error) {
    errorEl.textContent = "⚠️ Regex non valida: " + error.message;
    countEl.textContent = "0 risultati";
    resultEl.innerHTML = escapeHtml(text);
    return;
  }

  // Troviamo tutte le corrispondenze (ignorando quelle vuote)
  let matches = [...text.matchAll(regex)].filter((m) => m[0] !== "");
  if (!flagG.checked) {
    matches = matches.slice(0, 1); // senza "g" solo la prima
  }

  // Costruiamo il testo con le parti trovate evidenziate
  let html = "";
  let lastIndex = 0;
  matches.forEach((match) => {
    html += escapeHtml(text.slice(lastIndex, match.index));
    html += "<mark>" + escapeHtml(match[0]) + "</mark>";
    lastIndex = match.index + match[0].length;
  });
  html += escapeHtml(text.slice(lastIndex));

  resultEl.innerHTML = html;
  countEl.textContent =
    matches.length === 1 ? "1 risultato" : matches.length + " risultati";
}

patternInput.addEventListener("input", search);
textInput.addEventListener("input", search);
flagG.addEventListener("change", search);
flagI.addEventListener("change", search);

// ===== VALIDA =====
const validators = {
  email: {
    label: "Email",
    regex: /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i,
    example: "es. tumi@email.ch",
  },
  phone: {
    label: "Telefono svizzero",
    regex: /^(\+41|0041|0)\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/,
    example: "es. +41 79 123 45 67",
  },
  cap: {
    label: "CAP svizzero",
    regex: /^\d{4}$/,
    example: "es. 6900",
  },
  url: {
    label: "URL",
    regex: /^https?:\/\/[\w-]+(\.[\w-]+)+(\/\S*)?$/i,
    example: "es. https://tumi-menegalli.netlify.app",
  },
};

const buttons = document.querySelectorAll(".presets button");
const validateInput = document.querySelector("#validate-input");
const validateResult = document.querySelector("#validate-result");
let currentType = null;

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    buttons.forEach((b) => b.classList.remove("active"));
    button.classList.add("active");
    currentType = button.dataset.type;
    validateInput.placeholder = validators[currentType].example;
    validateInput.focus();
    validate();
  });
});

function validate() {
  const value = validateInput.value.trim();
  validateResult.className = "validate-result";

  if (currentType === null) {
    validateResult.textContent = value ? "☝️ Scegli prima un tipo" : "";
    return;
  }
  if (value === "") {
    validateResult.textContent = "";
    return;
  }

  const validator = validators[currentType];
  if (validator.regex.test(value)) {
    validateResult.textContent = "✓ " + validator.label + " valido";
    validateResult.classList.add("valid");
  } else {
    validateResult.textContent = "✗ " + validator.label + " non valido";
    validateResult.classList.add("invalid");
  }
}

validateInput.addEventListener("input", validate);