import "./index.scss";

import { calculate } from "./calc/calc";

const input = <HTMLInputElement>document.getElementById("calc");
const res = <HTMLParagraphElement>document.getElementById("res");

res.textContent = String(calculate(input.getAttribute("placeholder")!));
input.oninput = () => {
	if (input.value.length === 0) {
		res.textContent = String(calculate(input.getAttribute("placeholder")!));
		return;
	}
	try {
		res.textContent = String(calculate(input.value));
	} catch {
		res.textContent = "Invalid Input";
	}
};
