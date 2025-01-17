import { tokenize } from "./tokenizer";
import { parse } from "./parser";
import { evaluate } from "./evaluator";

export function calculate(input: string) {
	return evaluate(parse(tokenize(input)));
}
