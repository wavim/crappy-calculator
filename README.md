### Crappy Calculator

A web calculator that supports custom defined
constants, unary operators (functions) and binary operators (functions).

The calculator logic is implemented with a tokenizer (lexer), a LL parser and an evaluator,

- The tokenizer is responsible for lexing the input string into lexical tokens.
- The parser is responsible for constructing an Abstract Syntax Tree from the tokens.
- The evaluator is responsible for recursively evaluating the final expression value of the tree.

Brackets in the calculator is always ( and ),
with numerals essentially anything:  
1, 2.3, 0.05, 7.4e10, 10E-8, 0.1e+2 etc.

New constants, unary operators (functions) and binary operators (functions)
can be defined in no time inside a registry, specifying some details for them
(e.g. precedence for binary operators).

> Check the files in src/calculator/registry/, the code should be self-explanatory.

> Items symbols registered are CASE SENSITIVE.

To check out the calculator, click on the GitHub Page under the repository description :D

> The evaluator ultimately relies on JS,
> and is thus prone to all precision errors in JS.

Below are the items registered in the master branch.

#### Constants

- E = 2.71828... ($e$)
- PI = 3.14159... ($\pi$)

#### Unary Operators

- \+x (identity)
- \-x (negation)
- x! (factorial)

#### Unary Functions

- abs(x) (absolute value)
- sqrt(x) (square root)
- exp(x) (exponentiation base $e$)
- Ln(x) (natural log)
- log(x) (log base 10)
- sin(x) (sine radians)
- cos(x) (cosine radians)
- tan(x) (tangent radians)
- Gamma(x) (gamma function)

#### Binary Operators

- a \+ b (addition)
- a \- b (subtract)
- a \* b (multiplication)
- a \ b (division)
- a ^ b (power)
- a % b (modulo)

#### Binary Functions

- (a) min (b) (minimum)
- (a) max (b) (maximum)
- (n) P (r) (permutation)
- (n) C (r) (combination)

> It is worth noting that in some cases brackets () are not needed e.g. nPr and (n)P(r) is the same.  
> However, this is not always the case, and brackets should be preferred to avoid ambiguity.  
> If not, expressions like -1^0.5 = NaN can be confusing as you might think it is equivalent to -(1^0.5),
> but it is actually interpreted as (-1)^0.5.

You can also define your own items, or mess around with the existing.
(Switching + symbols with - is evilly fun lol)

Remember to play with the demo!
