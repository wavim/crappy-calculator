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
export type AST<T extends ASTKinds> = {
	//wrapper property to make pointer functional
	kind: T extends ASTKinds.Unset ? any : T;
	content: ASTValues<T>;
};

export enum ASTKinds {
	Unset,
	Numeral,
	Unary,
	Binary,
}
export type UnsetAST = AST<ASTKinds.Unset>;
export type NumeralAST = AST<ASTKinds.Numeral>;
export type UnaryAST = AST<ASTKinds.Unary>;
export type BinaryAST = AST<ASTKinds.Binary>;

export type ASTValues<K extends ASTKinds> = K extends ASTKinds.Unset
	? {
			[key: string]: any;
	  }
	: K extends ASTKinds.Numeral
	? {
			numeral: NumeralToken;
	  }
	: K extends ASTKinds.Unary
	? {
			operator: UnaryOperatorToken;
			argument?: AST<ASTKinds>;
	  }
	: {
			left: AST<ASTKinds>;
			operator?: BinaryOperatorToken;
			right?: AST<ASTKinds>;
	  };
//#endregion AST
