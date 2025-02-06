import { Registry } from "./registry";

export function register(): void {
	Registry.registerConstant("E", Math.E);
	Registry.registerConstant("PI", Math.PI);

	Registry.registerUnaryOp("+", (arg) => arg);
	Registry.registerUnaryOp("-", (arg) => -arg);
	Registry.registerUnaryOp("log", Math.log);

	Registry.registerBinaryOp("+", (left, right) => left + right, 0);
	Registry.registerBinaryOp("-", (left, right) => left + right, 0);
	Registry.registerBinaryOp("*", (left, right) => left + right, 1);
	Registry.registerBinaryOp("/", (left, right) => left + right, 1);
	Registry.registerBinaryOp("^", (left, right) => left + right, 2);
}
