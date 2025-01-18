import {
	AST,
	BinaryAST,
	NumeralAST,
	ASTTypes,
	UnaryAST,
	BinaryOperatorToken,
	BinaryOperatorValues,
	BracketValues,
	NumeralToken,
	Token,
	TokenTypes,
	UnaryOperatorToken,
	OperatorToken,
} from "./types";

/**
 * @param LexTokens lexical tokens from tokenize()
 * @returns Abstract Syntax Tree (wrapped to mimic ptrs in js) after parsing the lexical tokens
 */
export function parse(LexTokens: Token<TokenTypes>[]): AST<ASTTypes> {
	if (LexTokens.length === 1) {
		const token = LexTokens[0];
		if (token.type !== TokenTypes.Numeral) throw new SyntaxError(`Invalid orphan token at index ${token.index}.`);
		return wrapAST({
			num: <NumeralToken>token,
		});
	}

	const root: AST<ASTTypes> = { content: {} };
	let pointer: AST<ASTTypes> = root;
	let index = 0;
	while (index < LexTokens.length) {
		const _token = LexTokens[index];
		switch (_token.type) {
			case TokenTypes.Bracket: {
				const rightIndex = balanceBracket(LexTokens, index);
				const bracketTree = parse(LexTokens.slice(index + 1, rightIndex));
				index = rightIndex;

				if (!(<{ operator?: OperatorToken }>pointer.content).operator) {
					pointer.content = (
						index + 1 === LexTokens.length ? bracketTree : <AST<BinaryAST>>wrapAST({ left: bracketTree })
					).content;
					break;
				}
				if ((<UnaryAST | BinaryAST>pointer.content).operator!.type === TokenTypes.UnaryOperator) {
					(<UnaryAST>pointer.content).arg = bracketTree;
					break;
				}
				(<BinaryAST>pointer.content).right = bracketTree;
				break;
			}

			case TokenTypes.UnaryOperator: {
				const token = <UnaryOperatorToken>_token;

				const unOpTree: AST<UnaryAST> = wrapAST({ operator: token });
				if (!(<{ operator?: OperatorToken }>pointer.content).operator) {
					pointer.content = unOpTree.content;
					break;
				}
				if ((<{ operator: OperatorToken }>pointer.content).operator.type === TokenTypes.UnaryOperator) {
					(<UnaryAST>pointer.content).arg = unOpTree;
				} else {
					(<BinaryAST>pointer.content).right = unOpTree;
				}
				pointer = unOpTree;
				break;
			}

			case TokenTypes.BinaryOperator: {
				const token = <BinaryOperatorToken>_token;

				if (
					(<{ left: AST<ASTTypes> }>pointer.content).left &&
					!(<{ operator: OperatorToken }>pointer.content).operator
				) {
					(<BinaryAST>pointer.content).operator = token;
					break;
				}
				const lowPrior = token.value === BinaryOperatorValues.Add || token.value === BinaryOperatorValues.Sub;
				const afterUnOp =
					(<{ operator: OperatorToken }>pointer.content).operator.type === TokenTypes.UnaryOperator;
				const binOpTree: AST<BinaryAST> = wrapAST({
					left: structuredClone(lowPrior || afterUnOp ? pointer : (<BinaryAST>pointer.content).right),
					operator: token,
				});
				if (lowPrior || afterUnOp) {
					pointer.content = binOpTree.content;
					break;
				}
				(<BinaryAST>pointer.content).right = binOpTree;
				pointer = binOpTree;
				break;
			}

			case TokenTypes.Numeral: {
				const token = <NumeralToken>_token;

				const numTree: AST<NumeralAST> = wrapAST({ num: token });
				if (!(<{ operator?: OperatorToken }>pointer.content).operator) {
					pointer.content = wrapAST({
						left: numTree,
					}).content;
					break;
				}
				if ((<{ operator: OperatorToken }>pointer.content).operator.type === TokenTypes.UnaryOperator) {
					(<UnaryAST>pointer.content).arg = numTree;
				} else {
					(<BinaryAST>pointer.content).right = numTree;
				}
				break;
			}
		}
		index++;
	}
	return root;
}

/**
 * @returns index of the matching right bracket for left bracket at `leftIndex` in `lexTokens`
 */
function balanceBracket(lexTokens: Token<TokenTypes>[], leftIndex: number): number {
	let rightIndex = leftIndex;
	let level = 1;
	while (rightIndex < lexTokens.length) {
		rightIndex++;
		if (lexTokens[rightIndex].type !== TokenTypes.Bracket) continue;
		if (lexTokens[rightIndex].value === BracketValues.Left) level++;
		else level--;
		if (level === 0) break;
	}
	if (level !== 0) throw new SyntaxError(`No matching right bracket for left bracket at index ${leftIndex}`);
	if (rightIndex === leftIndex + 1) throw new SyntaxError(`Empty brackets at index ${leftIndex}.`);
	return rightIndex;
}

/**
 * @returns wrapped AST, used to mimic ptr behavior in js
 */
function wrapAST<T extends ASTTypes>(content: T): AST<T> {
	return {
		content,
	};
}
