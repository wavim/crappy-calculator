import {
	AST,
	NumeralAST,
	ASTTypes,
	BinaryOperatorToken,
	BinaryOperatorValues,
	NumeralToken,
	TokenTypes,
	UnaryOperatorToken,
	UnaryOperatorValues,
} from "./types";

/**
 * @returns final expression value of AST with recursion
 */
export function evaluate(AbstractSyntaxTree: AST<ASTTypes>): number {
	if ((<
			{
				num?: NumeralToken;
			}
		>AbstractSyntaxTree.content).num) {
		return (<NumeralAST>AbstractSyntaxTree.content).num.value;
	}

	if ((<
			{
				operator: UnaryOperatorToken | BinaryOperatorToken;
			}
		>AbstractSyntaxTree.content).operator.type === TokenTypes.UnaryOperator) {
		const ast = (<
			{
				content: {
					operator: UnaryOperatorToken;
					arg: AST<ASTTypes>;
				};
			}
		>AbstractSyntaxTree).content;
		const arg = evaluate(ast.arg);
		return ast.operator.value === UnaryOperatorValues.Pos ? arg : -arg;
	}

	const ast = (<
		{
			content: {
				left: AST<ASTTypes>;
				operator: BinaryOperatorToken;
				right: AST<ASTTypes>;
			};
		}
	>AbstractSyntaxTree).content;
	const left = evaluate(ast.left);
	const right = evaluate(ast.right);

	switch (ast.operator.value) {
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
