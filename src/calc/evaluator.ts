import { AST, ASTKinds, BinaryAST, BinaryOperatorValues, NumeralAST, UnaryAST, UnaryOperatorValues } from "./types";

/**
 * @param ast AST from parse()
 * @returns final expression value of AST with recursion
 */
export function evaluate(ast: AST<ASTKinds>): number {
	switch (ast.kind) {
		case ASTKinds.Numeral: {
			return (<NumeralAST>ast).content.numeral.value;
		}

		case ASTKinds.Unary: {
			const argument = evaluate((<UnaryAST>ast).content.argument!);
			return (<UnaryAST>ast).content.operator.value === UnaryOperatorValues.Pos ? argument : -argument;
		}

		case ASTKinds.Binary: {
			const left = evaluate((<BinaryAST>ast).content.left);
			const right = evaluate((<BinaryAST>ast).content.right!);

			switch ((<BinaryAST>ast).content.operator!.value) {
				case BinaryOperatorValues.Add: {
					return left + right;
				}

				case BinaryOperatorValues.Sub: {
					return left - right;
				}

				case BinaryOperatorValues.Mul: {
					return left * right;
				}

				case BinaryOperatorValues.Div: {
					return left / right;
				}

				case BinaryOperatorValues.Pow: {
					return left ** right;
				}
			}
		}

		default: {
			return NaN;
		}
	}
}
