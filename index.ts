import "./index.scss";

import { calc } from "./calc";

const input = <HTMLInputElement>document.getElementById("calc");
const res = <HTMLParagraphElement>document.getElementById("res");

res.textContent = String(calc(input.getAttribute("placeholder")));
input.oninput = () => {
	if (input.value.length === 0) {
		res.textContent = String(calc(input.getAttribute("placeholder")));
		return;
	}
	try {
		res.textContent = String(calc(input.value));
	} catch {
		res.textContent = "Invalid Input";
	}
};
