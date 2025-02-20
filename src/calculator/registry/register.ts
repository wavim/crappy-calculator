import { Enums } from "../constants/enums";
import { Registry } from "./registry";
import { Functions } from "../maths/functions";

/**
 * Place to define custom constants, unary operators and binary operators
 */
export function register(): void {
	//#region Constants
	Registry.registerConstant("e", {
		symbol: "E",
		value: Math.E,
	});
	Registry.registerConstant("pi", {
		symbol: "PI",
		value: Math.PI,
	});
	//#endregion

	//#region Unary Operators
	Registry.registerUnaryOp("pos", {
		symbol: "+",
		type: Enums.UnaryOpTypes.Prefix,
		callback: (a) => a,
	});
	Registry.registerUnaryOp("neg", {
		symbol: "-",
		type: Enums.UnaryOpTypes.Prefix,
		callback: (a) => -a,
	});
	Registry.registerUnaryOp("factorial", {
		symbol: "!",
		type: Enums.UnaryOpTypes.Postfix,
		callback: Functions.factorial,
	});
	//#endregion

	//#region Unary Functions
	Registry.registerUnaryOp("abs", {
		symbol: "absolute",
		type: Enums.UnaryOpTypes.Function,
		callback: Math.abs,
	});
	Registry.registerUnaryOp("floor", {
		symbol: "floor",
		type: Enums.UnaryOpTypes.Function,
		callback: Math.floor,
	});
	Registry.registerUnaryOp("ceil", {
		symbol: "ceil",
		type: Enums.UnaryOpTypes.Function,
		callback: Math.ceil,
	});
	Registry.registerUnaryOp("round", {
		symbol: "round",
		type: Enums.UnaryOpTypes.Function,
		callback: Math.round,
	});
	Registry.registerUnaryOp("sqrt", {
		symbol: "sqrt",
		type: Enums.UnaryOpTypes.Function,
		callback: Math.sqrt,
	});
	Registry.registerUnaryOp("exp", {
		symbol: "exp",
		type: Enums.UnaryOpTypes.Function,
		callback: Math.exp,
	});
	Registry.registerUnaryOp("log", {
		symbol: "Ln",
		type: Enums.UnaryOpTypes.Function,
		callback: Math.log,
	});
	Registry.registerUnaryOp("log10", {
		symbol: "log",
		type: Enums.UnaryOpTypes.Function,
		callback: Math.log10,
	});
	Registry.registerUnaryOp("sin", {
		symbol: "sin",
		type: Enums.UnaryOpTypes.Function,
		callback: Math.sin,
	});
	Registry.registerUnaryOp("cos", {
		symbol: "cos",
		type: Enums.UnaryOpTypes.Function,
		callback: Math.cos,
	});
	Registry.registerUnaryOp("tan", {
		symbol: "tan",
		type: Enums.UnaryOpTypes.Function,
		callback: Math.tan,
	});
	Registry.registerUnaryOp("asin", {
		symbol: "asin",
		type: Enums.UnaryOpTypes.Function,
		callback: Math.asin,
	});
	Registry.registerUnaryOp("acos", {
		symbol: "acos",
		type: Enums.UnaryOpTypes.Function,
		callback: Math.acos,
	});
	Registry.registerUnaryOp("atan", {
		symbol: "atan",
		type: Enums.UnaryOpTypes.Function,
		callback: Math.atan,
	});
	Registry.registerUnaryOp("gamma", {
		symbol: "Gamma",
		type: Enums.UnaryOpTypes.Function,
		callback: Functions.gamma,
	});
	//#endregion

	//#region Binary Operators
	Registry.registerBinaryOp("add", {
		symbol: "+",
		callback: (a, b) => a + b,
		precedence: 0,
	});
	Registry.registerBinaryOp("sub", {
		symbol: "-",
		callback: (a, b) => a - b,
		precedence: 0,
	});
	Registry.registerBinaryOp("mul", {
		symbol: "*",
		callback: (a, b) => a * b,
		precedence: 1,
	});
	Registry.registerBinaryOp("div", {
		symbol: "/",
		callback: (a, b) => a / b,
		precedence: 1,
	});
	Registry.registerBinaryOp("int_div", {
		symbol: "//",
		callback: (a, b) => Math.floor(a / b),
		precedence: 1,
	});
	Registry.registerBinaryOp("pow", {
		symbol: "**",
		callback: (a, b) => a ** b,
		precedence: 2,
	});
	Registry.registerBinaryOp("pow_alias", {
		symbol: "^",
		callback: (a, b) => a ** b,
		precedence: 2,
	});
	Registry.registerBinaryOp("mod", {
		symbol: "%",
		callback: (a, b) => a % b,
		precedence: 2,
	});
	//#endregion

	//#region Binary Functions
	//This constant is needed since precedence is shared among binary operators & functions
	const BINARY_FUNCTION_PRECEDENCE_BASE = 100;
	Registry.registerBinaryOp("min", {
		symbol: "min",
		callback: Math.min,
		precedence: BINARY_FUNCTION_PRECEDENCE_BASE,
	});
	Registry.registerBinaryOp("max", {
		symbol: "max",
		callback: Math.max,
		precedence: BINARY_FUNCTION_PRECEDENCE_BASE,
	});
	Registry.registerBinaryOp("permutation", {
		symbol: "P",
		callback: Functions.permutation,
		precedence: BINARY_FUNCTION_PRECEDENCE_BASE,
	});
	Registry.registerBinaryOp("combination", {
		symbol: "C",
		callback: Functions.combination,
		precedence: BINARY_FUNCTION_PRECEDENCE_BASE,
	});
	//#endregion
}
