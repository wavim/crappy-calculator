import { Tokenizer } from "./main/tokenizer";
import { Parser } from "./main/parser";
import { Evaluator } from "./main/evaluator";

export namespace Calculator {
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

	export function value(input: string): number {
		return calculate(input).value;
	}
}
