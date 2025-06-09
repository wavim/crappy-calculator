import { TokenTypes, UnaryOpTypes } from "../constants/enums";
import "../registry/register";
import {
	constantRegistry,
	existBinaryOp,
	existConstantWithSymbol,
	getBinaryOp,
	getBinaryOpSymbols,
	getConstantSymbols,
	getUnaryOpSymbols,
	getUnaryOpWithSymbol,
	unaryOpRegistry,
} from "../registry/registry";

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
		public type: TokenTypes,
		public symbol: string,

		public meta: { from: number; to: number },
	) {}

	get position(): string {
		return this.meta.from === this.meta.to
			? `${this.meta.from}`
			: `${this.meta.from}-${this.meta.to}`;
	}

	toString(): string {
		return `[${this.position}] ${this.symbol}`;
	}

	toJSON(): Object {
		return {
			symbol: this.symbol,
			meta: this.meta,
		};
	}
}

const escapeSymbol = (pattern: string) => {
	return pattern.replaceAll(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const TOKEN_TYPE_CNT = Object.keys(TokenTypes).length / 2;

const TOKEN_TYPES_RE: Record<number, RegExp> = {
	[TokenTypes.Bracket]: /[()]/,

	[TokenTypes.Numeral]: new RegExp(
		`(?:${getConstantSymbols()
			.sort((a, b) => b.length - a.length)
			.map(escapeSymbol)
			.join(")|(?:")})|(?:\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?)`,
	),

	[TokenTypes.UnaryOp]: new RegExp(
		`(?:${getUnaryOpSymbols()
			.sort((a, b) => b.length - a.length)
			.map(escapeSymbol)
			.join(")|(?:")})`,
	),

	[TokenTypes.BinaryOp]: new RegExp(
		`(?:${getBinaryOpSymbols()
			.sort((a, b) => b.length - a.length)
			.map(escapeSymbol)
			.join(")|(?:")})`,
	),
};

function digest(input: string, index: number, tokens: Token[]): string {
	let match: string | undefined;

	for (let type = 0; type < TOKEN_TYPE_CNT; type++) {
		const tokenTypeRE = new RegExp(
			`^\\s*(?:${TOKEN_TYPES_RE[type].source})\\s*`,
		);

		match = input.match(tokenTypeRE)?.[0];
		if (match === undefined) continue;

		let symbol = match.trimStart();

		const from = index + match.length - symbol.length;
		symbol = symbol.trimEnd();
		const to = from + symbol.length - 1;
		const meta = { from, to };

		const lookback = tokens.at(-1);

		switch (type) {
			case TokenTypes.Bracket: {
				if (handleBracket(tokens, symbol, lookback, meta)) break;
				continue;
			}

			case TokenTypes.Numeral: {
				if (handleNumeral(tokens, symbol, lookback, meta)) break;
				continue;
			}

			case TokenTypes.UnaryOp: {
				if (handleUnaryOp(tokens, symbol, lookback, meta)) break;
				continue;
			}

			case TokenTypes.BinaryOp: {
				if (handleBinaryOp(tokens, symbol, lookback, meta)) break;
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
	lookback: Token | undefined,

	meta: { from: number; to: number },
): number | false {
	const afterExp =
		lookback?.symbol === ")" ||
		lookback?.type === TokenTypes.Numeral ||
		(lookback?.type === TokenTypes.UnaryOp &&
			getUnaryOpWithSymbol(lookback.symbol).type === UnaryOpTypes.Postfix);

	if (symbol === "(" && afterExp && existBinaryOp("mul")) {
		const implicitMul = new Token(
			TokenTypes.BinaryOp,
			getBinaryOp("mul").symbol,
			meta,
		);
		tokens.push(implicitMul);
	}

	const bracket = new Token(TokenTypes.Bracket, symbol, meta);

	return tokens.push(bracket);
}

function handleNumeral(
	tokens: Token[],
	symbol: string,
	lookback: Token | undefined,

	meta: { from: number; to: number },
): number | false {
	const afterExp =
		lookback?.symbol === ")" ||
		lookback?.type === TokenTypes.Numeral ||
		(lookback?.type === TokenTypes.UnaryOp &&
			getUnaryOpWithSymbol(lookback.symbol).type === UnaryOpTypes.Postfix);

	if (afterExp) {
		if (existConstantWithSymbol(symbol) && existBinaryOp("mul")) {
			const implicitMul = new Token(
				TokenTypes.BinaryOp,
				getBinaryOp("mul").symbol,
				meta,
			);
			tokens.push(implicitMul);
		} else {
			return false;
		}
	}

	const numeral = new Token(TokenTypes.Numeral, symbol, meta);

	return tokens.push(numeral);
}

function handleUnaryOp(
	tokens: Token[],
	symbol: string,
	lookback: Token | undefined,

	meta: { from: number; to: number },
): number | false {
	const afterExp =
		lookback?.symbol === ")" ||
		lookback?.type === TokenTypes.Numeral ||
		(lookback?.type === TokenTypes.UnaryOp &&
			getUnaryOpWithSymbol(lookback.symbol).type === UnaryOpTypes.Postfix);

	switch (getUnaryOpWithSymbol(symbol).type) {
		case UnaryOpTypes.Prefix: {
			if (afterExp) return false;
			break;
		}

		case UnaryOpTypes.Postfix: {
			if (!afterExp) return false;
			break;
		}

		case UnaryOpTypes.Function: {
			if (!afterExp || !existBinaryOp("mul")) break;

			const implicitMul = new Token(
				TokenTypes.BinaryOp,
				getBinaryOp("mul").symbol,
				meta,
			);
			tokens.push(implicitMul);

			break;
		}
	}

	const unaryOp = new Token(TokenTypes.UnaryOp, symbol, meta);

	return tokens.push(unaryOp);
}

function handleBinaryOp(
	tokens: Token[],
	symbol: string,
	lookback: Token | undefined,

	meta: { from: number; to: number },
): number | false {
	const binaryOp = new Token(TokenTypes.BinaryOp, symbol, meta);

	return tokens.push(binaryOp);
}
