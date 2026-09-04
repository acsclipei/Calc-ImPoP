const display = document.getElementById("display");
const history = document.getElementById("history");
const scientific = document.getElementById("scientific");
const scientificBtn = document.getElementById("scientificBtn");

let expression = "";
let memory = 0;

function updateDisplay() {
    display.textContent = expression || "0";
}

function addValue(value) {
    expression += value;
    updateDisplay();
}

function clearCalculator() {
    expression = "";
    history.textContent = "";
    updateDisplay();
}

function deleteLast() {
    expression = expression.slice(0, -1);
    updateDisplay();
}

function calculate() {

    if (!expression) return;

    try {

        let exp = expression;

        exp = exp.replace(/π/g, Math.PI);
        exp = exp.replace(/sqrt\(/g, "Math.sqrt(");
        exp = exp.replace(/sin\(/g, "Math.sin(");
        exp = exp.replace(/cos\(/g, "Math.cos(");
        exp = exp.replace(/tan\(/g, "Math.tan(");
        exp = exp.replace(/log\(/g, "Math.log10(");
        exp = exp.replace(/ln\(/g, "Math.log(");
        exp = exp.replace(/\^/g, "**");

        exp = exp.replace(/(\d+(?:\.\d+)?)%/g, "($1/100)");

        const result = Function(
            `"use strict"; return (${exp})`
        )();

        if (!Number.isFinite(result)) {
            throw new Error();
        }

        history.textContent = expression + " =";

        expression = Number(result.toFixed(12)).toString();

        updateDisplay();

    } catch {
        display.textContent = "Erro";
        expression = "";
    }
}

function memoryAction(action) {

    const value = parseFloat(expression) || 0;

    if (action === "mc") {
        memory = 0;
    }

    if (action === "mr") {
        expression = memory.toString();
    }

    if (action === "mplus") {
        memory += value;
    }

    if (action === "mminus") {
        memory -= value;
    }

    updateDisplay();
}

document.querySelectorAll("button").forEach(button => {

    button.addEventListener("click", () => {

        const value = button.dataset.value;
        const action = button.dataset.action;

        if (value) {
            addValue(value);
        }

        if (action === "clear") {
            clearCalculator();
        }

        if (action === "delete") {
            deleteLast();
        }

        if (action === "calculate") {
            calculate();
        }

        if (
            action === "mc" ||
            action === "mr" ||
            action === "mplus" ||
            action === "mminus"
        ) {
            memoryAction(action);
        }
    });
});

scientificBtn.addEventListener("click", () => {

    scientific.classList.toggle("hidden");

    scientificBtn.textContent =
        scientific.classList.contains("hidden")
        ? "☷"
        : "×";
});

document.addEventListener("keydown", event => {

    const key = event.key;

    if (
        /[0-9+\-*/().]/.test(key)
    ) {
        addValue(key);
    }

    if (key === "Enter") {
        calculate();
    }

    if (key === "Backspace") {
        deleteLast();
    }

    if (key === "Escape") {
        clearCalculator();
    }

});
