const TOKEN_TYPES = ["NUM", "OP", "SEP", "INV"];

const TOKENS_RE = {
	NUM: /(?:[\+\-])?\d+(?:\.\d+)?(e[+\-]\d+)?/,
	OP: /[\+\-\*\/\^]/,
	SEP: /\s+/,
	INV: /.*/,
};

const OP_TYPES = {
	"+": "BIN_ADD",
	"-": "BIN_SUB",
	"*": "BIN_MUL",
	"/": "BIN_DIV",
	"^": "BIN_POW",
};

type token = {
	type: string;
	val: any;
};

//calculation entry
export function calc(input: string): number {
	return evaluate(parse(lex(input.trim())));
}

//get lexical tokens
function lex(input: string): token[] {
	const tokens = [];
	let res = input;
	while (res.length > 0) {
		let token;
		let type;
		for (let i = 0; i < TOKEN_TYPES.length; i++) {
			type = <keyof typeof TOKENS_RE>TOKEN_TYPES[i];
			const re = new RegExp(`^(?:${TOKENS_RE[type].source})`);
			token = res.match(re)?.[0];
			if (token === "-" && tokens.at(-1)?.type === "OP") continue;
			if (token) break;
		}
		token = <string>token;
		res = res.slice(token.length);

		let val;
		switch (type) {
			case "NUM":
				val = Number(token);
				break;
			case "OP":
				val = OP_TYPES[<keyof typeof OP_TYPES>token];
				break;
			case "SEP":
				continue;
			case "INV":
				throw new SyntaxError();
		}

		if (type === "NUM" && /^[\+\-]/.test(token) && tokens.at(-1)?.type === "NUM") {
			tokens.push({ val: "BIN_ADD", type: "OP" });
		}
		tokens.push({
			val,
			type: <"NUM" | "OP">type,
		});
	}
	return tokens;
}

//get Abstract Syntax Tree
//MO TODO add AST as type
function parse(lexed: token[]): {
	left: Object;
	op: Object;
	right: Object;
} {
	let ast: {
		left: Object;
		op: Object;
		right: Object;
	} = {
		left: lexed[0] ?? { val: 0, type: "NUM" },
		op: lexed[1] ?? { val: "BIN_ADD", type: "OP" },
		right: lexed[2] ?? { val: 0, type: "NUM" },
	};
	for (let i = 0; i < (lexed.length - 3) / 2; i++) {
		const op = lexed[3 + 2 * i];
		const right = lexed[4 + 2 * i];
		if (op.val === "BIN_ADD" || op.val === "BIN_SUB") {
			ast = {
				left: structuredClone(ast),
				op,
				right,
			};
			continue;
		}
		ast.right = {
			left: structuredClone(ast.right),
			op,
			right,
		};
	}
	return ast;
}

//recursively evaluates the value of AST
function evaluate(parsed: { left: Object; op: Object; right: Object } | { type: string; val: any }): number {
	if ((<{ type?: string }>parsed).type === "NUM") return (<{ val: any }>parsed).val;

	const left = evaluate(
		(<{ left: { left: Object; op: Object; right: Object }; op: Object; right: Object }>parsed).left,
	);
	const op = (<{ left: Object; op: { type: string; val: any }; right: Object }>parsed).op.val;
	const right = evaluate(
		(<
			{
				left: Object;
				op: Object;
				right: { left: { left: Object; op: Object; right: Object }; op: Object; right: Object };
			}
		>parsed).right,
	);

	if (op === "BIN_ADD") return left + right;
	if (op === "BIN_SUB") return left - right;
	if (op === "BIN_MUL") return left * right;
	if (op === "BIN_DIV") return left / right;
	if (op === "BIN_POW") return left ** right;
}
