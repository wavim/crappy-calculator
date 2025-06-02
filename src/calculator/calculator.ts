import { Tokenizer } from "./main/tokenizer";
import { Parser } from "./main/parser";
import { Evaluator } from "./main/evaluator";

/**
 * Main calculation entries
 */
export namespace Calculator {
	/**
	 * Main calculation entry.
	 * @returns lexical tokens, AST and the evaluated value packed
	 */
	export function calculate(input: string): {
		tokens: Tokenizer.Token[];
		tree: Parser.RootTree;
		value: number;
	} {
		const tokens = Tokenizer.tokenize(input);
		const tree = Parser.parse(tokens);
		const value = Evaluator.evaluate(tree);

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
}
