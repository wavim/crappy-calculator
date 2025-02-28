import { Enums } from "../constants/enums";
import { Registry } from "../registry/registry";
import "../registry/register";

/**
 * Tokenize raw input string into lexical tokens
 */
export namespace Tokenizer {
	/**
	 * Main tokenization entry for raw input strings
	 */
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

	export class Token {
		constructor(
			public type: Enums.TokenTypes,
			public symbol: string,
			public meta: { from: number; to: number },
		) {}

		toString(): string {
			return `Token[${this.meta.from}-${this.meta.to}]<${Enums.TokenTypes[this.type]}> ${
				this.symbol
			}`;
		}
	}

	const escapeSymbol = (pattern: string) => pattern.replaceAll(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const TOKEN_TYPE_CNT = Object.keys(Enums.TokenTypes).length / 2;
	const TOKEN_TYPES_RE: { [type: number]: RegExp } = {
		[Enums.TokenTypes.Bracket]: /[()]/,
		[Enums.TokenTypes.Numeral]: new RegExp(
			`(?:${Registry.getConstantSymbols()
				.sort((a, b) => b.length - a.length)
				.map(escapeSymbol)
				.join(")|(?:")})|(?:\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?)`,
		),
		[Enums.TokenTypes.UnaryOp]: new RegExp(
			`(?:${Registry.getUnaryOpSymbols()
				.sort((a, b) => b.length - a.length)
				.map(escapeSymbol)
				.join(")|(?:")})`,
		),
		[Enums.TokenTypes.BinaryOp]: new RegExp(
			`(?:${Registry.getBinaryOpSymbols()
				.sort((a, b) => b.length - a.length)
				.map(escapeSymbol)
				.join(")|(?:")})`,
		),
	};

	function digest(input: string, index: number, tokens: Token[]): string {
		let match: string | undefined;
		for (let type = 0; type < TOKEN_TYPE_CNT; type++) {
			const tokenTypeRE = new RegExp(`^\\s*(?:${TOKEN_TYPES_RE[type].source})\\s*`);
			match = input.match(tokenTypeRE)?.[0];
			if (match === undefined) continue;

			let symbol = match.trimStart();
			const from = index + match.length - symbol.length;
			symbol = symbol.trimEnd();
			const to = from + symbol.length - 1;
			const meta = { from, to };
			const lookback = tokens.at(-1);

			switch (type) {
				case Enums.TokenTypes.Bracket: {
					if (handleBracket(tokens, symbol, meta, lookback)) break;
					continue;
				}
				case Enums.TokenTypes.Numeral: {
					if (handleNumeral(tokens, symbol, meta, lookback)) break;
					continue;
				}
				case Enums.TokenTypes.UnaryOp: {
					if (handleUnaryOp(tokens, symbol, meta, lookback)) break;
					continue;
				}
				case Enums.TokenTypes.BinaryOp: {
					if (handleBinaryOp(tokens, symbol, meta, lookback)) break;
					continue;
				}
			}
			break;
		}
		if (!match) throw new SyntaxError(`Invalid symbol at ${index}.`);
		return match;
	}

	function handleBracket(
		tokens: Token[],
		symbol: string,
		meta: { from: number; to: number },
		lookback: Token | undefined,
	): number | false {
		const afterEntry =
			lookback?.symbol === ")" ||
			lookback?.type === Enums.TokenTypes.Numeral ||
			(lookback?.type === Enums.TokenTypes.UnaryOp &&
				Registry.getUnaryOpWithSymbol(lookback.symbol).type === Enums.UnaryOpTypes.Postfix);
		if (symbol === "(" && afterEntry && Registry.existBinaryOp("mul")) {
			const implicitMul = new Token(
				Enums.TokenTypes.BinaryOp,
				Registry.getBinaryOp("mul").symbol,
				meta,
			);
			tokens.push(implicitMul);
		}
		const bracket = new Token(Enums.TokenTypes.Bracket, symbol, meta);
		return tokens.push(bracket);
	}

	function handleNumeral(
		tokens: Token[],
		symbol: string,
		meta: { from: number; to: number },
		lookback: Token | undefined,
	): number | false {
		const afterEntry =
			lookback?.symbol === ")" ||
			lookback?.type === Enums.TokenTypes.Numeral ||
			(lookback?.type === Enums.TokenTypes.UnaryOp &&
				Registry.getUnaryOpWithSymbol(lookback.symbol).type === Enums.UnaryOpTypes.Postfix);
		if (Registry.existConstantWithSymbol(symbol) && afterEntry && Registry.existBinaryOp("mul")) {
			const implicitMul = new Token(
				Enums.TokenTypes.BinaryOp,
				Registry.getBinaryOp("mul").symbol,
				meta,
			);
			tokens.push(implicitMul);
		}
		const numeral = new Token(Enums.TokenTypes.Numeral, symbol, meta);
		return tokens.push(numeral);
	}

	function handleUnaryOp(
		tokens: Token[],
		symbol: string,
		meta: { from: number; to: number },
		lookback: Token | undefined,
	): number | false {
		const afterEntry =
			lookback?.symbol === ")" ||
			lookback?.type === Enums.TokenTypes.Numeral ||
			(lookback?.type === Enums.TokenTypes.UnaryOp &&
				Registry.getUnaryOpWithSymbol(lookback.symbol).type === Enums.UnaryOpTypes.Postfix);
		switch (Registry.getUnaryOpWithSymbol(symbol).type) {
			case Enums.UnaryOpTypes.Prefix: {
				if (afterEntry) return false;
				break;
			}
			case Enums.UnaryOpTypes.Postfix: {
				if (!afterEntry) return false;
				break;
			}
			case Enums.UnaryOpTypes.Function: {
				if (!afterEntry || !Registry.existBinaryOp("mul")) break;
				const implicitMul = new Token(
					Enums.TokenTypes.BinaryOp,
					Registry.getBinaryOp("mul").symbol,
					meta,
				);
				tokens.push(implicitMul);
				break;
			}
		}
		const unaryOp = new Token(Enums.TokenTypes.UnaryOp, symbol, meta);
		return tokens.push(unaryOp);
	}

	function handleBinaryOp(
		tokens: Token[],
		symbol: string,
		meta: { from: number; to: number },
		lookback: Token | undefined,
	): number | false {
		const binaryOp = new Token(Enums.TokenTypes.BinaryOp, symbol, meta);
		return tokens.push(binaryOp);
	}
}
