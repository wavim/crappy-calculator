//#region TOKEN
export type Token<T extends TokenTypes> = {
	type: T;
	value: TokenValues<T>;
	index: number;
};

export const TokenTypesCnt = 4;
export enum TokenTypes {
	Bracket,
	UnaryOperator,
	BinaryOperator,
	Numeral,
}
export type BracketToken = Token<TokenTypes.Bracket>;
export type OperatorToken = UnaryOperatorToken | BinaryOperatorToken;
export type UnaryOperatorToken = Token<TokenTypes.UnaryOperator>;
export type BinaryOperatorToken = Token<TokenTypes.BinaryOperator>;
export type NumeralToken = Token<TokenTypes.Numeral>;

export enum BracketValues {
	Left,
	Right,
}
export enum UnaryOperatorValues {
	Pos,
	Neg,
}
export enum BinaryOperatorValues {
	Add,
	Sub,
	Mul,
	Div,
	Pow,
}

type TokenValues<T extends TokenTypes> = T extends TokenTypes.Bracket
	? BracketValues
	: T extends TokenTypes.UnaryOperator
	? UnaryOperatorValues
	: T extends TokenTypes.BinaryOperator
	? BinaryOperatorValues
	: number;
//#endregion TOKEN

//#region AST
export type AST<T extends ASTTypes | {}> = {
	//wrapper property to make changing pointer functional
	content: T;
};

export type ASTTypes = NumeralAST | UnaryAST | BinaryAST;
export type NumeralAST = {
	num: NumeralToken;
};
export type UnaryAST = {
	operator?: UnaryOperatorToken;
	arg?: AST<ASTTypes>;
};
export type BinaryAST = {
	left?: AST<ASTTypes>;
	operator?: BinaryOperatorToken;
	right?: AST<ASTTypes>;
};
//#endregion AST
