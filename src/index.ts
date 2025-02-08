import "./index.scss";

import { Enums } from "./calc/constants/enums";
import { Tokenizer } from "./calc/main/tokenizer";
import { Parser } from "./calc/main/parser";
import { Evaluator } from "./calc/main/evaluator";
import { Calculator } from "./calc/calculator";

const TOKEN_RENDER_CNT_LIMIT = 100;

const inputElement = <HTMLInputElement>document.getElementById("input");
const resultElement = <HTMLDivElement>document.getElementById("result");

updateResult(<string>inputElement.getAttribute("placeholder"));
inputElement.oninput = () => updateResult(inputElement.value);

function updateResult(input: string): void {
	console.clear();
	resultElement.classList.remove("error");

	let result: ReturnType<typeof Calculator.calculate>;
	try {
		result = Calculator.calculate(
			input.length === 0 ? <string>inputElement.getAttribute("placeholder") : input,
		);
	} catch (error) {
		resultElement.innerHTML = "";
		resultElement.classList.add("error");

		const errorElement = document.createElement("p");
		errorElement.textContent = `${error}`.replace(/.*Error: /, "");
		resultElement.appendChild(errorElement);
		return;
	}

	console.log(`${result.tree}`);
	renderResult(result.tokens, result.value);
}

function renderResult(tokens: Tokenizer.Token[], value: number): void {
	resultElement.innerHTML = "";

	if (tokens.length > TOKEN_RENDER_CNT_LIMIT) {
		const expressionElement = document.createElement("p");
		expressionElement.textContent = "Expression";
		resultElement.appendChild(expressionElement);
	} else {
		for (const token of tokens) {
			const tokenElement = document.createElement("p");
			tokenElement.textContent = token.symbol;
			tokenElement.className = Enums.TokenTypes[token.type];
			resultElement.appendChild(tokenElement);
		}
	}

	const equalElement = document.createElement("p");
	equalElement.textContent = ` = `;
	resultElement.appendChild(equalElement);

	const valueElement = document.createElement("p");
	valueElement.textContent = `${value}`;
	resultElement.appendChild(valueElement);
}
