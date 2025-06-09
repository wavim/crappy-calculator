import { evaluate } from "./main/evaluator";
import { RootTree, parse } from "./main/parser";
import { Token, tokenize } from "./main/tokenizer";

/**
 * Main calculation entry.
 * @returns lexical tokens, AST and the evaluated value packed
 */
export function calculate(input: string): {
	tokens: Token[];
	tree: RootTree;
	value: number;
} {
	const tokens = tokenize(input);
	const tree = parse(tokens);
	const value = evaluate(tree);

	return {
		tokens,
		tree,
		value,
	};
}

/**
 * Main calculation entry.
 * @returns the final evaluated value
 */
export function value(input: string): number {
	return calculate(input).value;
}
