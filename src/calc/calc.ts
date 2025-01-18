import { tokenize } from "./tokenizer";
import { parse } from "./parser";
import { evaluate } from "./evaluator";

/**
 * Main calculation entry
 */
export function calculate(input: string): number {
	return evaluate(parse(tokenize(input)));
}
