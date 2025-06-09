import { TreeTypes } from "../constants/enums";
import {
	existConstantWithSymbol,
	getBinaryOpWithSymbol,
	getConstantWithSymbol,
	getUnaryOpWithSymbol,
} from "../registry/registry";
import {
	BinaryOpTree,
	NumeralTree,
	RootTree,
	TreeTypesType,
	UnaryOpTree,
} from "./parser";

/**
 * Main evaluation entry for ASTs
 */
export function evaluate(tree: TreeTypesType): number {
	switch (tree.type) {
		case TreeTypes.Root: {
			return handleRootTree(<RootTree>tree);
		}

		case TreeTypes.Numeral: {
			return handleNumeralTree(<NumeralTree>tree);
		}

		case TreeTypes.UnaryOp: {
			return handleUnaryOpTree(<UnaryOpTree>tree);
		}

		case TreeTypes.BinaryOp: {
			return handleBinaryOpTree(<BinaryOpTree>tree);
		}
	}
}

function handleRootTree(tree: RootTree): number {
	if (!tree.content) throw new SyntaxError("Evaluating empty tree.");

	return evaluate(tree.content);
}

function handleNumeralTree(tree: NumeralTree): number {
	const symbol = tree.numToken.symbol;

	return existConstantWithSymbol(symbol)
		? getConstantWithSymbol(symbol).value
		: Number(symbol);
}

function handleUnaryOpTree(tree: UnaryOpTree): number {
	if (!tree.argument) {
		throw new SyntaxError(
			`Unary operator lacks argument at ${tree.opToken.position}.`,
		);
	}

	const callback = getUnaryOpWithSymbol(tree.operator.symbol).callback;

	return callback(evaluate(tree.argument));
}

function handleBinaryOpTree(tree: BinaryOpTree): number {
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

	const callback = getBinaryOpWithSymbol(tree.operator.symbol).callback;

	const left = evaluate(tree.left);
	const right = evaluate(tree.right);

	return callback(left, right);
}
