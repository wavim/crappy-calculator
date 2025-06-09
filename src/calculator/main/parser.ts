import { TokenTypes, TreeTypes, UnaryOpTypes } from "../constants/enums";
import {
	BinaryOp,
	UnaryOp,
	getBinaryOpWithSymbol,
	getUnaryOpWithSymbol,
} from "../registry/registry";
import { Token } from "./tokenizer";

type ParserRuntime = {
	index: number;
	tokens: Token[];
	pointer: TreeTypesType;
	position: () => string;
};

/**
 * Main parsing entry for lexical tokens
 */
export function parse(tokens: Token[]): RootTree {
	const root = new RootTree();

	const runtime: ParserRuntime = {
		index: 0,
		tokens,
		pointer: root,

		position: () => {
			const token = runtime.tokens[runtime.index];
			return token.position;
		},
	};

	while (runtime.index < tokens.length) {
		const token = tokens[runtime.index];

		switch (token.type) {
			case TokenTypes.Bracket: {
				handleBracket(token, runtime);
				break;
			}

			case TokenTypes.Numeral: {
				handleNumeral(token, runtime);
				break;
			}

			case TokenTypes.UnaryOp: {
				handleUnaryOp(token, runtime);
				break;
			}

			case TokenTypes.BinaryOp: {
				handleBinaryOp(token, runtime);
				break;
			}
		}

		runtime.index++;
	}

	return root;
}

export class Tree {
	constructor(public type: TreeTypes, public precedence: number) {}

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
		super(TreeTypes.Root, ROOT_PRECEDENCE);
	}

	toString(): string {
		return this.content ? this.content.toString() : "<Empty>";
	}

	toJSON(): Object {
		return this.content?.toJSON() ?? {};
	}
}

export class NumeralTree extends Tree {
	constructor(
		public parent: Exclude<TreeTypesType, NumeralTree>,
		public numToken: Token,
	) {
		super(TreeTypes.Numeral, NUMERAL_PRECEDENCE);
	}

	toString(): string {
		return `<Num> ${this.numToken}`;
	}

	toJSON(): Object {
		return {
			numeral: this.numToken.toJSON(),
		};
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

	operator: UnaryOp;

	constructor(
		public parent: Exclude<TreeTypesType, NumeralTree>,
		public opToken: Token,
	) {
		super(TreeTypes.UnaryOp, UNARYOP_PRECEDENCE);

		this.operator = getUnaryOpWithSymbol(opToken.symbol);
	}

	toString(level: number = 1): string {
		const indent = "\n" + "  \u2503  ".repeat(level);

		return `<Unary>${indent}UOp: ${this.opToken} (${
			this.operator.id
		})${indent}Arg: ${
			this.argument ? this.argument.toString(level + 1) : "<Empty>"
		}`;
	}

	toJSON(): Object {
		return {
			operator: {
				...this.opToken.toJSON(),
				...this.operator,
				type: UnaryOpTypes[this.operator.type],
			},
			argument: this.argument?.toJSON() ?? {},
		};
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

	operator: BinaryOp;

	constructor(
		public parent: Exclude<TreeTypesType, NumeralTree>,
		public opToken: Token,
	) {
		const operator = getBinaryOpWithSymbol(opToken.symbol);

		super(TreeTypes.BinaryOp, operator.precedence);

		this.operator = operator;
	}

	toString(level: number = 1): string {
		const indent = "\n" + "  \u2503  ".repeat(level);

		return `<Binary>${indent}BOp: ${this.opToken} (${
			this.operator.id
		})${indent}Lft: ${
			this.left ? this.left.toString(level + 1) : "<Empty>"
		}${indent}Rgt: ${this.right ? this.right.toString(level + 1) : "<Empty>"}`;
	}

	toJSON(): Object {
		return {
			operator: { ...this.opToken.toJSON(), ...this.operator },
			left: this.left?.toJSON() ?? {},
			right: this.right?.toJSON() ?? {},
		};
	}
}

function handleBracket(token: Token, runtime: ParserRuntime): void {
	if (token.symbol === ")") {
		throw new SyntaxError(`Lone right bracket at ${runtime.position()}.`);
	}

	if (runtime.pointer.type === TreeTypes.Numeral) {
		throw new SyntaxError(
			`Missing operator before bracket at ${runtime.position()}.`,
		);
	}

	const open = runtime.index;
	let close = open;

	let nestLevel = 1;

	while (close < runtime.tokens.length - 1) {
		close++;

		if (runtime.tokens[close].type !== TokenTypes.Bracket) continue;

		if (runtime.tokens[close].symbol === "(") nestLevel++;
		else nestLevel--;

		if (nestLevel === 0) break;
	}

	if (nestLevel !== 0) {
		throw new SyntaxError(`Unbalanced bracket at ${runtime.position()}.`);
	}

	if (close === open + 1) {
		throw new SyntaxError(`Empty brackets at ${runtime.position()}.`);
	}

	runtime.index = close;

	const bracketTree = parse(runtime.tokens.slice(open + 1, close));

	bracketTree.content!.precedence = NUMERAL_PRECEDENCE;

	switch (runtime.pointer.type) {
		case TreeTypes.Root: {
			const pointer = <RootTree>runtime.pointer;

			runtime.pointer = pointer.content = bracketTree.content!;

			break;
		}

		case TreeTypes.UnaryOp: {
			const pointer = <UnaryOpTree>runtime.pointer;

			runtime.pointer = pointer.argument = bracketTree.content!;

			break;
		}

		case TreeTypes.BinaryOp: {
			const pointer = <BinaryOpTree>runtime.pointer;

			runtime.pointer = pointer.right = bracketTree.content!;

			break;
		}
	}
}

function handleNumeral(token: Token, runtime: ParserRuntime): void {
	if (runtime.pointer.type === TreeTypes.Numeral) {
		throw new SyntaxError(
			`Missing operator between numerals at ${runtime.position()}.`,
		);
	}

	const numeralTree = new NumeralTree(
		<Exclude<TreeTypesType, NumeralTree>>runtime.pointer,
		token,
	);

	switch (runtime.pointer.type) {
		case TreeTypes.Root: {
			const pointer = <RootTree>runtime.pointer;

			runtime.pointer = pointer.content = numeralTree;

			break;
		}

		case TreeTypes.UnaryOp: {
			const pointer = <UnaryOpTree>runtime.pointer;

			runtime.pointer = pointer.argument = numeralTree;

			break;
		}

		case TreeTypes.BinaryOp: {
			const pointer = <BinaryOpTree>runtime.pointer;

			runtime.pointer = pointer.right = numeralTree;

			break;
		}
	}
}

function handleUnaryOp(token: Token, runtime: ParserRuntime): void {
	while (
		runtime.pointer.type !== TreeTypes.Root &&
		runtime.pointer.precedence > UNARYOP_PRECEDENCE
	) {
		runtime.pointer = (<Exclude<TreeTypesType, RootTree>>(
			runtime.pointer
		)).parent;
	}

	const unaryOp = getUnaryOpWithSymbol(token.symbol);

	const isPostOp = unaryOp.type === UnaryOpTypes.Postfix;

	if (
		isPostOp &&
		!(
			(runtime.pointer.type === TreeTypes.Root &&
				(<RootTree>runtime.pointer).content) ||
			(runtime.pointer.type === TreeTypes.UnaryOp &&
				(<UnaryOpTree>runtime.pointer).argument) ||
			(runtime.pointer.type === TreeTypes.BinaryOp &&
				(<BinaryOpTree>runtime.pointer).right)
		)
	) {
		throw new SyntaxError(
			`Missing entry before postfix unary operator at ${runtime.position()}.`,
		);
	}

	const unaryOpTree = new UnaryOpTree(
		<Exclude<TreeTypesType, NumeralTree>>runtime.pointer,
		token,
	);

	switch (runtime.pointer.type) {
		case TreeTypes.Root: {
			const pointer = <RootTree>runtime.pointer;

			if (isPostOp) unaryOpTree.argument = pointer.content!.clone();

			runtime.pointer = pointer.content = unaryOpTree;

			break;
		}

		case TreeTypes.UnaryOp: {
			const pointer = <UnaryOpTree>runtime.pointer;

			if (isPostOp) unaryOpTree.argument = pointer.argument!.clone();

			runtime.pointer = pointer.argument = unaryOpTree;

			break;
		}

		case TreeTypes.BinaryOp: {
			const pointer = <BinaryOpTree>runtime.pointer;

			if (isPostOp) unaryOpTree.argument = pointer.right!.clone();

			runtime.pointer = pointer.right = unaryOpTree;

			break;
		}
	}
}

function handleBinaryOp(token: Token, runtime: ParserRuntime): void {
	if (runtime.pointer.type === TreeTypes.Root) {
		throw new SyntaxError(
			`Missing entry before binary operator at ${runtime.position()}.`,
		);
	}

	const binaryOp = getBinaryOpWithSymbol(token.symbol);

	while (
		(<Exclude<TreeTypesType, RootTree>>runtime.pointer).precedence >=
		binaryOp.precedence
	) {
		runtime.pointer = (<Exclude<TreeTypesType, RootTree>>(
			runtime.pointer
		)).parent;
	}

	const binaryOpTree = new BinaryOpTree(
		<Exclude<TreeTypesType, NumeralTree>>runtime.pointer,
		token,
	);

	switch (runtime.pointer.type) {
		case TreeTypes.Root: {
			const pointer = <RootTree>runtime.pointer;

			binaryOpTree.left = pointer.content!.clone();

			runtime.pointer = pointer.content = binaryOpTree;

			break;
		}

		case TreeTypes.UnaryOp: {
			const pointer = <UnaryOpTree>runtime.pointer;

			binaryOpTree.left = pointer.clone();

			runtime.pointer = pointer.argument = binaryOpTree;

			break;
		}

		case TreeTypes.BinaryOp: {
			const pointer = <BinaryOpTree>runtime.pointer;

			binaryOpTree.left = pointer.right!.clone();

			runtime.pointer = pointer.right = binaryOpTree;

			break;
		}
	}
}
