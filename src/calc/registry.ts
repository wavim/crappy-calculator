export namespace Registry {
	export type UnaryOpCallback = (arg: number) => number;
	export type BinaryOpCallback = (left: number, right: number) => number;

	export const ConstantRegistry: Map<string, number> = new Map();
	export const UnaryOpRegistry: Map<string, UnaryOpCallback> = new Map();
	export const BinaryOpRegistry: Map<
		string,
		{
			callback: BinaryOpCallback;
			precedence: number;
		}
	> = new Map();

	export function registerConstant(symbol: string, value: number): void {
		ConstantRegistry.set(symbol, value);
	}
	export function registerUnaryOp(symbol: string, callback: UnaryOpCallback): void {
		UnaryOpRegistry.set(symbol, callback);
	}
	export function registerBinaryOp(symbol: string, callback: BinaryOpCallback, precedence: number): void {
		BinaryOpRegistry.set(symbol, {
			callback,
			precedence,
		});
	}

	export function existConstant(symbol: string): boolean {
		return ConstantRegistry.has(symbol);
	}
	export function existUnaryOp(symbol: string): boolean {
		return UnaryOpRegistry.has(symbol);
	}
	export function existBinaryOp(symbol: string): boolean {
		return BinaryOpRegistry.has(symbol);
	}

	export function getConstantSymbols(): string[] {
		return [...ConstantRegistry.keys()].sort((a, b) => b.length - a.length);
	}
	export function getUnaryOpSymbols(): string[] {
		return [...UnaryOpRegistry.keys()].sort((a, b) => b.length - a.length);
	}
	export function getBinaryOpSymbols(): string[] {
		return [...BinaryOpRegistry.keys()].sort((a, b) => b.length - a.length);
	}

	export function getConstantValue(symbol: string): number {
		if (!existConstant(symbol)) throw new Error(`Constant ${symbol} not registered.`);
		return ConstantRegistry.get(symbol)!;
	}
	export function applyUnaryOp(symbol: string, arg: number): number {
		if (!existUnaryOp(symbol)) throw new Error(`Unary operator ${symbol} not registered.`);
		return UnaryOpRegistry.get(symbol)!(arg);
	}
	export function getBinaryOpPrecedence(symbol: string): number {
		if (!existBinaryOp(symbol)) throw new Error(`Binary operator ${symbol} not registered.`);
		return BinaryOpRegistry.get(symbol)!.precedence;
	}
	export function applyBinaryOp(symbol: string, left: number, right: number): number {
		if (!existBinaryOp(symbol)) throw new Error(`Binary operator ${symbol} not registered.`);
		return BinaryOpRegistry.get(symbol)!.callback(left, right);
	}
}
