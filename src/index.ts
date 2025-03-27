import "./index.scss";

import { Enums } from "./calculator/constants/enums";
import { Tokenizer } from "./calculator/main/tokenizer";
import { Parser } from "./calculator/main/parser";
import { Evaluator } from "./calculator/main/evaluator";
import { Calculator } from "./calculator/calculator";

const RENDER_LENGTH_LIMIT = 50;

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
			input.length === 0
				? <string>inputElement.getAttribute("placeholder")
				: input,
		);
	} catch (error) {
		resultElement.innerHTML = "";
		resultElement.classList.add("error");

		const errorElement = document.createElement("p");
		errorElement.textContent = `${error}`.replace(/.*Error: /, "");
		resultElement.appendChild(errorElement);
		return;
	}

	console.log("<AST>", result.tree.toJSON());
	console.log(`${result.tree}`);

	renderResult(result.tokens, result.value);
}

function renderResult(tokens: Tokenizer.Token[], value: number): void {
	resultElement.innerHTML = "";

	if (
		tokens.reduce((sum, token) => sum + token.symbol.length, <number>0) >
		RENDER_LENGTH_LIMIT
	) {
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
