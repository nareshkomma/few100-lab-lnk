import * as format from './format';

const storage = localStorage;

const fixedTipPercentOptions = [10, 15, 20];

const checkAmountInput = document.getElementById("check-amount-input") as HTMLInputElement;
const tipPercentGroup = document.getElementById("fixed-tip-percent-group") as HTMLDivElement;
let fixedTipButtons: NodeListOf<HTMLButtonElement>;
const customTipInput = document.getElementById("tip-percentage-input") as HTMLInputElement;

const checkAmountOutput = document.getElementById("check-amount");
const tipPercentageOutput = document.getElementById("tip-percentage");
const tipPercentageMessageAmountOutput = document.getElementById("tip-percentage-message-amount");
const tipAmountOutput = document.getElementById("tip-amount");
const totalAmountOutput = document.getElementById("total-amount");


let tip: Tip;

export class Tip {

    get isValid(): boolean {
        return this.checkAmountIsValid && this.tipPercentIsValid;
    }

    get checkAmountIsValid(): boolean {
        return this.checkAmount >= 0;
    }

    get tipPercentIsValid(): boolean {
        return this.tipPercent >= 0;
    }

    get tipAmount(): number {
        return this.isValid
            ? this.checkAmount * this.tipPercent / 100
            : 0;
    }

    get totalAmount(): number {
        return this.isValid
            ? this.tipAmount + this.checkAmount
            : 0;
    }

    constructor(public tipPercent: number = 20, public checkAmount: number = 0, public split = 1) {
    }
}

function checkAmountChanged(e: any) {
    const el = e.currentTarget as HTMLInputElement;
    tip.checkAmount = +el.value || 0;
    updateUi();
}

function fixedTipButtonClicked(e: any) {
    const el = e.currentTarget;
    tip.tipPercent = +el.dataset["tipPercent"];
    customTipInput.value = "";
    storage.setItem("tipPercent", tip.tipPercent.toString());
    updateButtonStatus();
    updateUi();
}

function customTipPercentChanged(e: any) {
    const el = e.srcElement as HTMLInputElement;
    el.dataset["tipPercent"] = el.value || "0";
    tip.tipPercent = +el.dataset["tipPercent"];
    storage.setItem("tipPercent", tip.tipPercent.toString());
    updateButtonStatus();
    updateUi();
}

function updateButtonStatus() {

    fixedTipButtons.forEach(b => {
        const button = b as HTMLElement;
        if (button.dataset["tipPercent"] === tip.tipPercent.toString()) {
            button.setAttribute("disabled", void 0);
        } else {
            button.removeAttribute("disabled");
        }
    });
}

function setupUi() {
    fixedTipPercentOptions.forEach(opt => {
        const button = document.createElement("button");
        button.classList.add("btn", "btn-secondary");
        button.dataset.tipPercent = opt.toString();
        button.innerText = format.percentage(opt);
        tipPercentGroup.appendChild(button);
        button.addEventListener('click', fixedTipButtonClicked);
    });
    fixedTipButtons = document.querySelectorAll("#tip-percent-group .btn") as NodeListOf<HTMLButtonElement>;
    customTipInput.addEventListener("input", customTipPercentChanged);
    checkAmountInput.addEventListener("input", checkAmountChanged);
}

function updateUi() {
    if (tip.checkAmountIsValid) {
        checkAmountInput.classList.remove("is-invalid");
    } else {
        checkAmountInput.classList.add("is-invalid");
    }
    if (tip.tipPercentIsValid) {
        customTipInput.classList.remove("is-invalid");
    } else {
        customTipInput.classList.add("is-invalid");
    }
    if (!checkAmountInput.value && tip.checkAmount) {
        checkAmountInput.value = tip.checkAmount.toString();
    }
    if (!customTipInput.value && tip.tipPercent && fixedTipPercentOptions.indexOf(tip.tipPercent) == -1) {
        customTipInput.value = tip.tipPercent.toString();
    }
    const isValid = tip.checkAmountIsValid && tip.tipPercentIsValid;
    checkAmountOutput.innerText = isValid ? format.currency(tip.checkAmount) : "";
    tipPercentageOutput.innerText = isValid ? format.percentage(tip.tipPercent) : "";
    tipPercentageMessageAmountOutput.innerText = isValid ? format.percentage(tip.tipPercent) : "";
    tipAmountOutput.innerText = isValid ? format.currency(tip.tipAmount) : "";
    totalAmountOutput.innerText = isValid ? format.currency(tip.totalAmount) : "";
}

/**
 * Initializes the tip calculator
 */
export function init() {

    const tipPercent = +localStorage.getItem("tipPercent");
    tip = new Tip(tipPercent);

    setupUi();
    updateUi();
    updateButtonStatus();

    console.log("tip module initialized")
}