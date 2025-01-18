import { BinaryOperatorValues, BracketValues, Token, TokenTypes, TokenTypesCnt, UnaryOperatorValues } from "./types";

export function tokenize(input: string): Token<TokenTypes>[] {
	const length = input.length;

	const tokens: Token<TokenTypes>[] = [];
	while (input.length) {
		const index = length - input.length;

		const match = digest(input, tokens, index);
		if (!match) throw new SyntaxError(`Unknown symbol at index ${index}.`);

		input = input.slice(match.length);
	}
	return tokens;
}

const TokenTypesRE = {
	[TokenTypes.Bracket]: /[\(\)]/,
	[TokenTypes.UnaryOperator]: /[\+\-]/,
	[TokenTypes.BinaryOperator]: /[\+\-\*\/\^]/,
	[TokenTypes.Numeral]: /\d+(?:\.\d+)?(?:[eE](?:[\+\-])?\d+)?/,
};

function digest(input: string, tokens: Token<TokenTypes>[], index: number): string | undefined {
	let match: string | undefined;
	for (let i = 0; i < TokenTypesCnt; i++) {
		const tokenTypeRE = new RegExp(`^\\s*${TokenTypesRE[<keyof typeof TokenTypesRE>i].source}\\s*`);
		match = input.match(tokenTypeRE)?.[0];
		if (!match) continue;

		const literal = match.trim();
		switch (i) {
			case TokenTypes.Bracket: {
				const bracketValue = literal === "(" ? BracketValues.Left : BracketValues.Right;
				const last = tokens.at(-1);
				if (last?.type === TokenTypes.Numeral && bracketValue === BracketValues.Left) {
					tokens.push({
						type: TokenTypes.BinaryOperator,
						value: BinaryOperatorValues.Mul,
						index,
					});
				}
				tokens.push({
					type: TokenTypes.Bracket,
					value: bracketValue,
					index,
				});
				break;
			}

			// @ts-ignore intended fallthrough case if token is actually binary +/-
			case TokenTypes.UnaryOperator: {
				const last = tokens.at(-1);
				if (
					last?.type === undefined ||
					(last?.type === TokenTypes.Bracket && last.value === BracketValues.Left) ||
					last?.type === TokenTypes.UnaryOperator ||
					last?.type === TokenTypes.BinaryOperator
				) {
					tokens.push({
						type: TokenTypes.UnaryOperator,
						value: literal === "-" ? UnaryOperatorValues.Neg : UnaryOperatorValues.Pos,
						index,
					});
					break;
				}
			}

			case TokenTypes.BinaryOperator: {
				tokens.push({
					type: TokenTypes.BinaryOperator,
					value: {
						"+": BinaryOperatorValues.Add,
						"-": BinaryOperatorValues.Sub,
						"*": BinaryOperatorValues.Mul,
						"/": BinaryOperatorValues.Div,
						"^": BinaryOperatorValues.Pow,
					}[<"+" | "-" | "*" | "/" | "^">literal],
					index,
				});
				break;
			}

			case TokenTypes.Numeral: {
				tokens.push({
					type: TokenTypes.Numeral,
					value: Number(literal),
					index,
				});
				break;
			}
		}
		break;
	}
	return match;
}
