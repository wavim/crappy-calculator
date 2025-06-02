import { Enums } from "../constants/enums";

/**
 * Manager for custom registered items
 */
export namespace Registry {
	type Id = { id: string };

	export type Constant = Id & {
		symbol: string;
		value: number;
	};

	export type UnaryOpCallback = (argument: number) => number;

	export type UnaryOp = Id & {
		symbol: string;
		type: Enums.UnaryOpTypes;
		callback: UnaryOpCallback;
	};

	export type BinaryOpCallback = (left: number, right: number) => number;

	export type BinaryOp = Id & {
		symbol: string;
		callback: BinaryOpCallback;
		precedence: number;
	};

	export const constantRegistry: Map<string, Constant> = new Map();
	export const constantSymbolRegistry: Map<string, Constant> = new Map();

	export const unaryOpRegistry: Map<string, UnaryOp> = new Map();
	export const unaryOpSymbolRegistry: Map<string, UnaryOp> = new Map();

	export const binaryOpRegistry: Map<string, BinaryOp> = new Map();
	export const binaryOpSymbolRegistry: Map<string, BinaryOp> = new Map();

	export function existConstant(id: string): boolean {
		return constantRegistry.has(id);
	}
	export function existConstantWithSymbol(symbol: string): boolean {
		return constantSymbolRegistry.has(symbol);
	}

	export function existUnaryOp(id: string): boolean {
		return unaryOpRegistry.has(id);
	}
	export function existUnaryOpWithSymbol(symbol: string): boolean {
		return unaryOpSymbolRegistry.has(symbol);
	}

	export function existBinaryOp(id: string): boolean {
		return binaryOpRegistry.has(id);
	}
	export function existBinaryOpWithSymbol(symbol: string): boolean {
		return binaryOpSymbolRegistry.has(symbol);
	}

	/**
	 * Register a new constant e.g. E -> 2.718...
	 */
	export function registerConstant(
		id: string,
		constant: Omit<Constant, "id">,
	): void {
		if (existConstant(id)) {
			throw new Error(`Constant with id ${id} already exists.`);
		}
		if (existConstantWithSymbol(constant.symbol)) {
			throw new Error(
				`Constant with symbol ${constant.symbol} already exists.`,
			);
		}
		constantRegistry.set(id, { id, ...constant });
		constantSymbolRegistry.set(constant.symbol, { id, ...constant });
	}
	/**
	 * Register a new unary operator e.g. negation (-), abs
	 */
	export function registerUnaryOp(
		id: string,
		unaryOp: Omit<UnaryOp, "id">,
	): void {
		if (existUnaryOp(id)) {
			throw new Error(`Unary operator with id ${id} already exists.`);
		}
		if (existUnaryOpWithSymbol(unaryOp.symbol)) {
			throw new Error(
				`Unary operator with symbol ${unaryOp.symbol} already exists.`,
			);
		}
		unaryOpRegistry.set(id, { id, ...unaryOp });
		unaryOpSymbolRegistry.set(unaryOp.symbol, { id, ...unaryOp });
	}
	/**
	 * Register a new binary operator e.g. *, nPr
	 */
	export function registerBinaryOp(
		id: string,
		binaryOp: Omit<BinaryOp, "id">,
	): void {
		if (existBinaryOp(id)) {
			throw new Error(`Binary operator with id ${id} already exists.`);
		}
		if (existBinaryOpWithSymbol(binaryOp.symbol)) {
			throw new Error(
				`Binary operator with symbol ${binaryOp.symbol} already exists.`,
			);
		}
		binaryOpRegistry.set(id, { id, ...binaryOp });
		binaryOpSymbolRegistry.set(binaryOp.symbol, { id, ...binaryOp });
	}

	export function getConstantSymbols(): string[] {
		return [...constantSymbolRegistry.keys()];
	}

	export function getUnaryOpSymbols(): string[] {
		return [...unaryOpSymbolRegistry.keys()];
	}

	export function getBinaryOpSymbols(): string[] {
		return [...binaryOpSymbolRegistry.keys()];
	}

	export function getConstant(id: string): Constant {
		if (!existConstant(id)) {
			throw new Error(`Constant with id ${id} is not registered.`);
		}
		return constantRegistry.get(id)!;
	}
	export function getConstantWithSymbol(symbol: string): Constant {
		if (!existConstantWithSymbol(symbol)) {
			throw new Error(`Constant with symbol ${symbol} is not registered.`);
		}
		return constantSymbolRegistry.get(symbol)!;
	}

	export function getUnaryOp(id: string): UnaryOp {
		if (!existUnaryOp(id)) {
			throw new Error(`Unary operator with id ${id} is not registered.`);
		}
		return unaryOpRegistry.get(id)!;
	}
	export function getUnaryOpWithSymbol(symbol: string): UnaryOp {
		if (!existUnaryOpWithSymbol(symbol)) {
			throw new Error(
				`Unary operator with symbol ${symbol} is not registered.`,
			);
		}
		return unaryOpSymbolRegistry.get(symbol)!;
	}

	export function getBinaryOp(id: string): BinaryOp {
		if (!existBinaryOp(id)) {
			throw new Error(`Binary operator with id ${id} is not registered.`);
		}
		return binaryOpRegistry.get(id)!;
	}
	export function getBinaryOpWithSymbol(symbol: string): BinaryOp {
		if (!existBinaryOpWithSymbol(symbol)) {
			throw new Error(
				`Binary operator with symbol ${symbol} is not registered.`,
			);
		}
		return binaryOpSymbolRegistry.get(symbol)!;
	}
}
