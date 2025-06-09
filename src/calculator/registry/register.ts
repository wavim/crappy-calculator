// Place to define custom constants, unary operators and binary operators

import { UnaryOpTypes } from "../constants/enums";
import {
	combination,
	factorial,
	gamma,
	gcd,
	permutation,
} from "../maths/functions";
import {
	registerBinaryOp,
	registerConstant,
	registerUnaryOp,
} from "./registry";

//#region Constants
registerConstant("e", {
	symbol: "E",
	value: Math.E,
});

registerConstant("pi", {
	symbol: "PI",
	value: Math.PI,
});

registerConstant("inf", {
	symbol: "INF",
	value: Infinity,
});
//#endregion

//#region Unary Operators
registerUnaryOp("pos", {
	symbol: "+",
	type: UnaryOpTypes.Prefix,
	callback: (a) => a,
});

registerUnaryOp("neg", {
	symbol: "-",
	type: UnaryOpTypes.Prefix,
	callback: (a) => -a,
});

registerUnaryOp("percent", {
	symbol: "%",
	type: UnaryOpTypes.Postfix,
	callback: (a) => 0.01 * a,
});

registerUnaryOp("factorial", {
	symbol: "!",
	type: UnaryOpTypes.Postfix,
	callback: factorial,
});

registerUnaryOp("degree", {
	symbol: "d",
	type: UnaryOpTypes.Postfix,
	callback: (d) => (Math.PI * d) / 180,
});
//#endregion

//#region Unary Functions
registerUnaryOp("abs", {
	symbol: "abs",
	type: UnaryOpTypes.Function,
	callback: Math.abs,
});

registerUnaryOp("floor", {
	symbol: "floor",
	type: UnaryOpTypes.Function,
	callback: Math.floor,
});

registerUnaryOp("ceil", {
	symbol: "ceil",
	type: UnaryOpTypes.Function,
	callback: Math.ceil,
});

registerUnaryOp("round", {
	symbol: "round",
	type: UnaryOpTypes.Function,
	callback: Math.round,
});

registerUnaryOp("sqrt", {
	symbol: "sqrt",
	type: UnaryOpTypes.Function,
	callback: Math.sqrt,
});

registerUnaryOp("exp", {
	symbol: "exp",
	type: UnaryOpTypes.Function,
	callback: Math.exp,
});

registerUnaryOp("log", {
	symbol: "Ln",
	type: UnaryOpTypes.Function,
	callback: Math.log,
});

registerUnaryOp("log10", {
	symbol: "log",
	type: UnaryOpTypes.Function,
	callback: Math.log10,
});

registerUnaryOp("sin", {
	symbol: "sin",
	type: UnaryOpTypes.Function,
	callback: Math.sin,
});

registerUnaryOp("cos", {
	symbol: "cos",
	type: UnaryOpTypes.Function,
	callback: Math.cos,
});

registerUnaryOp("tan", {
	symbol: "tan",
	type: UnaryOpTypes.Function,
	callback: Math.tan,
});

registerUnaryOp("asin", {
	symbol: "asin",
	type: UnaryOpTypes.Function,
	callback: Math.asin,
});

registerUnaryOp("acos", {
	symbol: "acos",
	type: UnaryOpTypes.Function,
	callback: Math.acos,
});

registerUnaryOp("atan", {
	symbol: "atan",
	type: UnaryOpTypes.Function,
	callback: Math.atan,
});

registerUnaryOp("gamma", {
	symbol: "Gamma",
	type: UnaryOpTypes.Function,
	callback: gamma,
});
//#endregion

//#region Binary Operators
registerBinaryOp("add", {
	symbol: "+",
	callback: (a, b) => a + b,
	precedence: 0,
});

registerBinaryOp("sub", {
	symbol: "-",
	callback: (a, b) => a - b,
	precedence: 0,
});

registerBinaryOp("mul", {
	symbol: "*",
	callback: (a, b) => a * b,
	precedence: 1,
});

registerBinaryOp("div", {
	symbol: "/",
	callback: (a, b) => a / b,
	precedence: 1,
});

registerBinaryOp("int_div", {
	symbol: "//",
	callback: (a, b) => Math.floor(a / b),
	precedence: 1,
});

registerBinaryOp("pow", {
	symbol: "**",
	callback: (a, b) => a ** b,
	precedence: 2,
});

registerBinaryOp("pow_alias", {
	symbol: "^",
	callback: (a, b) => a ** b,
	precedence: 2,
});

registerBinaryOp("mod", {
	symbol: "mod",
	callback: (a, b) => a % b,
	precedence: 2,
});
//#endregion

//#region Binary Functions
// this const is needed as precedence is shared among binary ops & functions
const BINARY_FUNCTION_PRECEDENCE_BASE = 100;

registerBinaryOp("min", {
	symbol: "min",
	callback: Math.min,
	precedence: BINARY_FUNCTION_PRECEDENCE_BASE,
});

registerBinaryOp("max", {
	symbol: "max",
	callback: Math.max,
	precedence: BINARY_FUNCTION_PRECEDENCE_BASE,
});

registerBinaryOp("permutation", {
	symbol: "P",
	callback: permutation,
	precedence: BINARY_FUNCTION_PRECEDENCE_BASE,
});

registerBinaryOp("combination", {
	symbol: "C",
	callback: combination,
	precedence: BINARY_FUNCTION_PRECEDENCE_BASE,
});

registerBinaryOp("gcd", {
	symbol: "gcd",
	callback: gcd,
	precedence: BINARY_FUNCTION_PRECEDENCE_BASE,
});
//#endregion
