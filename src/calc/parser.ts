import {
	AST,
	ASTKinds,
	ASTValues,
	BinaryAST,
	BinaryOperatorToken,
	BinaryOperatorValues,
	BracketValues,
	NumeralToken,
	Token,
	TokenTypes,
	UnaryAST,
	UnaryOperatorToken,
	UnsetAST,
} from "./types";

/**
 * @param lexTokens lexical tokens from tokenize()
 * @returns Abstract Syntax Tree (wrapped to mimic ptrs in js) after parsing the lexical tokens
 */
export function parse(lexTokens: Token<TokenTypes>[]): AST<ASTKinds> {
	if (lexTokens.length === 1) {
		const token = lexTokens[0];
		if (token.type !== TokenTypes.Numeral) throw new SyntaxError(`Invalid single token.`);
		return wrapAST(ASTKinds.Numeral, {
			numeral: <NumeralToken>token,
		});
	}

	const root: UnsetAST = { kind: ASTKinds.Unset, content: {} };
	let pointer: UnsetAST = root;

	let index = 0;
	while (index < lexTokens.length) {
		const _token = lexTokens[index];

		switch (_token.type) {
			case TokenTypes.Bracket: {
				const rightIndex = balanceBracket(lexTokens, index);
				const bracketTree = parse(lexTokens.slice(index + 1, rightIndex));
				index = rightIndex;

				switch (pointer.kind) {
					case ASTKinds.Unset: {
						const spansExpression = index === lexTokens.length - 1;
						if (spansExpression) {
							pointer.kind = bracketTree.kind;
							pointer.content = bracketTree.content;
							break;
						}
						pointer.kind = ASTKinds.Binary;
						pointer.content = wrapAST(ASTKinds.Binary, { left: bracketTree }).content;
						break;
					}

					case ASTKinds.Unary: {
						(<UnaryAST>pointer).content.argument = bracketTree;
						break;
					}

					case ASTKinds.Binary: {
						(<BinaryAST>pointer).content.right = bracketTree;
						break;
					}
				}
				break;
			}

			case TokenTypes.UnaryOperator: {
				const unaryTree = wrapAST(ASTKinds.Unary, { operator: <UnaryOperatorToken>_token });

				switch (pointer.kind) {
					case ASTKinds.Unset: {
						pointer.kind = ASTKinds.Unary;
						pointer.content = unaryTree.content;
						break;
					}

					case ASTKinds.Unary: {
						(<UnaryAST>pointer).content.argument = unaryTree;
						pointer = unaryTree;
						break;
					}

					case ASTKinds.Binary: {
						(<BinaryAST>pointer).content.right = unaryTree;
						pointer = unaryTree;
						break;
					}
				}
				break;
			}

			case TokenTypes.BinaryOperator: {
				const token = <BinaryOperatorToken>_token;

				if (pointer.kind === ASTKinds.Binary && !(<BinaryAST>pointer).content.operator) {
					(<BinaryAST>pointer).content.operator = token;
					break;
				}

				const isLowPrecedence =
					token.value === BinaryOperatorValues.Add || token.value === BinaryOperatorValues.Sub;
				const isUnderUnaryTree = pointer.kind === ASTKinds.Unary;

				const binaryTree = wrapAST(ASTKinds.Binary, {
					left: structuredClone(isLowPrecedence || isUnderUnaryTree ? pointer : pointer.content.right),
					operator: token,
				});

				if (isLowPrecedence || isUnderUnaryTree) {
					pointer.kind = ASTKinds.Binary;
					pointer.content = binaryTree.content;
					break;
				}

				(<BinaryAST>pointer).content.right = binaryTree;
				pointer = binaryTree;
				break;
			}

			case TokenTypes.Numeral: {
				const numeralTree = wrapAST(ASTKinds.Numeral, { numeral: <NumeralToken>_token });

				switch (pointer.kind) {
					case ASTKinds.Unset: {
						pointer.kind = ASTKinds.Binary;
						pointer.content = wrapAST(ASTKinds.Binary, {
							left: numeralTree,
						}).content;
						break;
					}

					case ASTKinds.Unary: {
						(<UnaryAST>pointer).content.argument = numeralTree;
						break;
					}

					case ASTKinds.Binary: {
						(<BinaryAST>pointer).content.right = numeralTree;
						break;
					}
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
function wrapAST<T extends ASTKinds>(kind: T extends ASTKinds.Unset ? any : T, content: ASTValues<T>): AST<T> {
	return {
		kind,
		content,
	};
}
