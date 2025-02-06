import { Registry } from "./registry";

export namespace Tokenizer {
	export enum TokenTypes {
		Bracket,
		Numeral,
		UnaryOp,
		BinaryOp,
	}

	export class Token {
		constructor(public type: TokenTypes, public symbol: string, public from: number, public to: number) {}

		toString(): string {
			return `Token[${this.from}-${this.to}]<${TokenTypes[this.type]}>`.padEnd(30) + this.symbol;
		}
	}

	export function tokenize(input: string): Token[] {
		const length = input.length;
		const tokens: Token[] = [];
		while (input.length) {
			const index = length - input.length;
			const match = digest(input, index, tokens);
			input = input.slice(match.length);
		}
		return tokens;
	}

	function escapeSymbolForRE(pattern: string): string {
		return pattern.replaceAll(/[.*+?^${}()|[\]\\]/g, "\\$&");
	}
	const BRACKET_TOKEN_RE = /[()]/;
	const NUMERAL_TOKEN_RE = new RegExp(
		`(?:${Registry.getConstantSymbols().map(escapeSymbolForRE).join(")|(?:")})|` +
			`(?:\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?)`,
	);
	const UNARYOP_TOKEN_RE = new RegExp(`(?:${Registry.getUnaryOpSymbols().map(escapeSymbolForRE).join(")|(?:")})`);
	const BINARYOP_TOKEN_RE = new RegExp(`(?:${Registry.getBinaryOpSymbols().map(escapeSymbolForRE).join(")|(?:")})`);
	const TOKEN_TYPES_RE: { [type: number]: RegExp } = {
		[TokenTypes.Bracket]: BRACKET_TOKEN_RE,
		[TokenTypes.Numeral]: NUMERAL_TOKEN_RE,
		[TokenTypes.UnaryOp]: UNARYOP_TOKEN_RE,
		[TokenTypes.BinaryOp]: BINARYOP_TOKEN_RE,
	};

	function digest(input: string, index: number, tokens: Token[]): string {
		let match: string | undefined;
		const TOKEN_TYPE_CNT = Object.keys(TokenTypes).length / 2;
		for (let type: TokenTypes = 0; type < TOKEN_TYPE_CNT; type++) {
			const tokenTypeRE = new RegExp(`^\\s*(?:${TOKEN_TYPES_RE[type].source})\\s*`);
			match = input.match(tokenTypeRE)?.[0];
			if (match === undefined) continue;

			const token = new Token(type, match.trim(), index, index + match.length);
			tokens.push(token);
			break;
		}
		if (!match) throw new SyntaxError(`Unknown symbol at index ${index}.`);
		return match;
	}
}
