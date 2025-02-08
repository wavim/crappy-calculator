import { Enums } from "../constants/enums";
import { Registry } from "../registry/registry";
import { Tokenizer } from "./tokenizer";

export namespace Parser {
	export class Tree {
		constructor(public type: Enums.TreeTypes, public precedence: number) {}
		clone(): typeof this {
			const clone = Object.create(Object.getPrototypeOf(this));
			Object.defineProperties(clone, Object.getOwnPropertyDescriptors(this));
			return clone;
		}
	}
	export type TreeTypesType = RootTree | NumeralTree | UnaryOpTree | BinaryOpTree;
	const ROOT_PRECEDENCE = -1;
	const NUMERAL_PRECEDENCE = Number.MAX_SAFE_INTEGER + 1;
	const UNARYOP_PRECEDENCE = Number.MAX_SAFE_INTEGER;

	export class RootTree extends Tree {
		$content?: Exclude<TreeTypesType, RootTree>;
		set content(content: Exclude<TreeTypesType, RootTree>) {
			this.$content = content;
			content.parent = this;
		}
		get content(): typeof this.$content {
			return this.$content;
		}

		constructor() {
			super(Enums.TreeTypes.Root, ROOT_PRECEDENCE);
		}

		toString(): string {
			return `${this.content ? this.content.toString() : "<Empty>"}`;
		}
	}
	export class NumeralTree extends Tree {
		constructor(public parent: Exclude<TreeTypesType, NumeralTree>, public numeral: Tokenizer.Token) {
			super(Enums.TreeTypes.Numeral, NUMERAL_PRECEDENCE);
		}

		toString(level: number = 1): string {
			const indent = "\n" + "  \u2503  ".repeat(level);
			return `Tree<Numeral>${indent}${this.numeral}`;
		}
	}
	export class UnaryOpTree extends Tree {
		$argument?: Exclude<TreeTypesType, RootTree>;
		set argument(argument: Exclude<TreeTypesType, RootTree>) {
			this.$argument = argument;
			argument.parent = this;
		}
		get argument(): typeof this.$argument {
			return this.$argument;
		}

		operator: Registry.UnaryOp;
		meta: { from: number; to: number };
		constructor(public parent: Exclude<TreeTypesType, NumeralTree>, public operatorToken: Tokenizer.Token) {
			super(Enums.TreeTypes.UnaryOp, UNARYOP_PRECEDENCE);
			this.operator = Registry.getUnaryOpWithSymbol(operatorToken.symbol);
			this.meta = operatorToken.meta;
		}

		toString(level: number = 1): string {
			const indent = "\n" + "  \u2503  ".repeat(level);
			return `Tree<Unary>${indent}Operator: ${this.operatorToken}${indent}Argument: ${
				this.argument ? this.argument.toString(level + 1) : "<Empty>"
			}`;
		}
	}
	export class BinaryOpTree extends Tree {
		$left?: Exclude<TreeTypesType, RootTree>;
		$right?: Exclude<TreeTypesType, RootTree>;
		set left(left: Exclude<TreeTypesType, RootTree>) {
			this.$left = left;
			left.parent = this;
		}
		get left(): typeof this.$left {
			return this.$left;
		}
		set right(right: Exclude<TreeTypesType, RootTree>) {
			this.$right = right;
			right.parent = this;
		}
		get right(): typeof this.$right {
			return this.$right;
		}

		operator: Registry.BinaryOp;
		meta: { from: number; to: number };
		constructor(public parent: Exclude<TreeTypesType, NumeralTree>, public operatorToken: Tokenizer.Token) {
			const operator = Registry.getBinaryOpWithSymbol(operatorToken.symbol);
			super(Enums.TreeTypes.BinaryOp, operator.precedence);
			this.operator = operator;
			this.meta = operatorToken.meta;
		}

		toString(level: number = 1): string {
			const indent = "\n" + "  \u2503  ".repeat(level);
			return `Tree<Binary>${indent}Operator: ${this.operatorToken}${indent}Left: ${
				this.left ? this.left.toString(level + 1) : "<Empty>"
			}${indent}Right: ${this.right ? this.right.toString(level + 1) : "<Empty>"}`;
		}
	}

	type ParserRuntime = {
		index: number;
		tokens: Tokenizer.Token[];
		pointer: TreeTypesType;
		position: () => string;
	};
	export function parse(tokens: Tokenizer.Token[]): RootTree {
		const root = new RootTree();
		const runtime: ParserRuntime = {
			index: 0,
			position: () => {
				const token = runtime.tokens[runtime.index];
				return `${token.meta.from} - ${token.meta.to}`;
			},
			tokens,
			pointer: root,
		};

		while (runtime.index < tokens.length) {
			const token = tokens[runtime.index];
			switch (token.type) {
				case Enums.TokenTypes.Bracket: {
					handleBracket(token, runtime);
					break;
				}
				case Enums.TokenTypes.Numeral: {
					handleNumeral(token, runtime);
					break;
				}
				case Enums.TokenTypes.UnaryOp: {
					handleUnaryOp(token, runtime);
					break;
				}
				case Enums.TokenTypes.BinaryOp: {
					handleBinaryOp(token, runtime);
					break;
				}
			}
			runtime.index++;
		}
		return root;
	}

	function handleBracket(token: Tokenizer.Token, runtime: ParserRuntime): void {
		if (token.symbol === ")") throw new SyntaxError(`Lone right bracket at ${runtime.position()}.`);
		if (runtime.pointer.type === Enums.TreeTypes.Numeral) {
			throw new SyntaxError(`Missing operator before bracket at ${runtime.position()}.`);
		}

		const open = runtime.index;
		let close = open;
		let nestLevel = 1;
		while (close < runtime.tokens.length - 1) {
			close++;
			if (runtime.tokens[close].type !== Enums.TokenTypes.Bracket) continue;
			if (runtime.tokens[close].symbol === "(") nestLevel++;
			else nestLevel--;
			if (nestLevel === 0) break;
		}
		if (nestLevel !== 0) throw new SyntaxError(`Unbalanced bracket at ${runtime.position()}.`);
		if (close === open + 1) throw new SyntaxError(`Empty brackets at ${runtime.position()}.`);
		runtime.index = close;

		const bracketTree = parse(runtime.tokens.slice(open + 1, close));
		bracketTree.content!.precedence = NUMERAL_PRECEDENCE;

		switch (runtime.pointer.type) {
			case Enums.TreeTypes.Root: {
				const pointer = <RootTree>runtime.pointer;
				runtime.pointer = pointer.content = bracketTree.content!;
				break;
			}
			case Enums.TreeTypes.UnaryOp: {
				const pointer = <UnaryOpTree>runtime.pointer;
				runtime.pointer = pointer.argument = bracketTree.content!;
				break;
			}
			case Enums.TreeTypes.BinaryOp: {
				const pointer = <BinaryOpTree>runtime.pointer;
				runtime.pointer = pointer.right = bracketTree.content!;
				break;
			}
		}
	}

	function handleNumeral(token: Tokenizer.Token, runtime: ParserRuntime): void {
		if (runtime.pointer.type === Enums.TreeTypes.Numeral) {
			throw new SyntaxError(`Missing operator between numerals at ${runtime.position()}.`);
		}
		const numeralTree = new NumeralTree(<Exclude<TreeTypesType, NumeralTree>>runtime.pointer, token);

		switch (runtime.pointer.type) {
			case Enums.TreeTypes.Root: {
				const pointer = <RootTree>runtime.pointer;
				runtime.pointer = pointer.content = numeralTree;
				break;
			}
			case Enums.TreeTypes.UnaryOp: {
				const pointer = <UnaryOpTree>runtime.pointer;
				runtime.pointer = pointer.argument = numeralTree;
				break;
			}
			case Enums.TreeTypes.BinaryOp: {
				const pointer = <BinaryOpTree>runtime.pointer;
				runtime.pointer = pointer.right = numeralTree;
				break;
			}
		}
	}

	function handleUnaryOp(token: Tokenizer.Token, runtime: ParserRuntime): void {
		while (
			runtime.pointer.type !== Enums.TreeTypes.Root &&
			runtime.pointer.precedence > UNARYOP_PRECEDENCE
		) {
			runtime.pointer = (<Exclude<TreeTypesType, RootTree>>runtime.pointer).parent;
		}

		const unaryOp = Registry.getUnaryOpWithSymbol(token.symbol);
		const isPostOp = unaryOp.type === Enums.UnaryOpTypes.Postfix;
		if (
			isPostOp &&
			!(
				(runtime.pointer.type === Enums.TreeTypes.Root &&
					(<RootTree>runtime.pointer).content) ||
				(runtime.pointer.type === Enums.TreeTypes.UnaryOp &&
					(<UnaryOpTree>runtime.pointer).argument) ||
				(runtime.pointer.type === Enums.TreeTypes.BinaryOp &&
					(<BinaryOpTree>runtime.pointer).right)
			)
		) {
			throw new SyntaxError(`Missing entry before postfix unary operator at ${runtime.position()}.`);
		}
		const unaryOpTree = new UnaryOpTree(<Exclude<TreeTypesType, NumeralTree>>runtime.pointer, token);

		switch (runtime.pointer.type) {
			case Enums.TreeTypes.Root: {
				const pointer = <RootTree>runtime.pointer;
				if (isPostOp) unaryOpTree.argument = pointer.content!.clone();
				runtime.pointer = pointer.content = unaryOpTree;
				break;
			}
			case Enums.TreeTypes.UnaryOp: {
				const pointer = <UnaryOpTree>runtime.pointer;
				if (isPostOp) unaryOpTree.argument = pointer.argument!.clone();
				runtime.pointer = pointer.argument = unaryOpTree;
				break;
			}
			case Enums.TreeTypes.BinaryOp: {
				const pointer = <BinaryOpTree>runtime.pointer;
				if (isPostOp) unaryOpTree.argument = pointer.right!.clone();
				runtime.pointer = pointer.right = unaryOpTree;
				break;
			}
		}
	}

	function handleBinaryOp(token: Tokenizer.Token, runtime: ParserRuntime): void {
		if (runtime.pointer.type === Enums.TreeTypes.Root) {
			throw new SyntaxError(`Missing entry before binary operator at ${runtime.position()}.`);
		}

		const binaryOp = Registry.getBinaryOpWithSymbol(token.symbol);
		while ((<Exclude<TreeTypesType, RootTree>>runtime.pointer).precedence >= binaryOp.precedence) {
			runtime.pointer = (<Exclude<TreeTypesType, RootTree>>runtime.pointer).parent;
		}
		const binaryOpTree = new BinaryOpTree(<Exclude<TreeTypesType, NumeralTree>>runtime.pointer, token);

		switch (runtime.pointer.type) {
			case Enums.TreeTypes.Root: {
				const pointer = <RootTree>runtime.pointer;
				binaryOpTree.left = pointer.content!.clone();
				runtime.pointer = pointer.content = binaryOpTree;
				break;
			}
			case Enums.TreeTypes.UnaryOp: {
				const pointer = <UnaryOpTree>runtime.pointer;
				binaryOpTree.left = pointer.clone();
				runtime.pointer = pointer.argument = binaryOpTree;
				break;
			}
			case Enums.TreeTypes.BinaryOp: {
				const pointer = <BinaryOpTree>runtime.pointer;
				binaryOpTree.left = pointer.right!.clone();
				runtime.pointer = pointer.right = binaryOpTree;
				break;
			}
		}
	}
}
