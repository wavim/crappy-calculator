import { Enums } from "../constants/enums";

import { Registry } from "../registry/registry";

import { Parser } from "./parser";

/**
 * Evaluate the final expression value of ASTs
 */
export namespace Evaluator {
	/**
	 * Main evaluation entry for ASTs
	 */
	export function evaluate(tree: Parser.TreeTypesType): number {
		switch (tree.type) {
			case Enums.TreeTypes.Root: {
				return handleRootTree(<Parser.RootTree>tree);
			}
			case Enums.TreeTypes.Numeral: {
				return handleNumeralTree(<Parser.NumeralTree>tree);
			}
			case Enums.TreeTypes.UnaryOp: {
				return handleUnaryOpTree(<Parser.UnaryOpTree>tree);
			}
			case Enums.TreeTypes.BinaryOp: {
				return handleBinaryOpTree(<Parser.BinaryOpTree>tree);
			}
		}
	}

	function handleRootTree(tree: Parser.RootTree): number {
		if (!tree.content) throw new SyntaxError("Evaluating empty tree.");

		return evaluate(tree.content);
	}

	function handleNumeralTree(tree: Parser.NumeralTree): number {
		const symbol = tree.numToken.symbol;
		return Registry.existConstantWithSymbol(symbol)
			? Registry.getConstantWithSymbol(symbol).value
			: Number(symbol);
	}

	function handleUnaryOpTree(tree: Parser.UnaryOpTree): number {
		if (!tree.argument) {
			throw new SyntaxError(
				`Unary operator lacks argument at ${tree.opToken.position}.`,
			);
		}

		const callback = Registry.getUnaryOpWithSymbol(
			tree.operator.symbol,
		).callback;
		return callback(evaluate(tree.argument));
	}

	function handleBinaryOpTree(tree: Parser.BinaryOpTree): number {
		if (!tree.left) {
			throw new SyntaxError(
				`Binary operator lacks left operand at ${tree.opToken.position}.`,
			);
		}
		if (!tree.right) {
			throw new SyntaxError(
				`Binary operator lacks right operand at ${tree.opToken.position}.`,
			);
		}

		const callback = Registry.getBinaryOpWithSymbol(
			tree.operator.symbol,
		).callback;
		const left = evaluate(tree.left);
		const right = evaluate(tree.right);
		return callback(left, right);
	}
}
