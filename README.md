[Notes](#notes)

A calculator that supports custom constants, unary operators /functions and
binary operators/functions.

- The tokenizer uses a lookbehind to lex the input expression into tokens
- The parser is responsible for constructing a parse tree from the tokens
- The evaluator recursively evaluates the parsed tree for the final value

Below are the items registered in the master branch.

#### Constants

- E = 2.71828... ($e$)
- PI = 3.14159... ($\pi$)
- INF = $\infty$ (infinity)

#### Unary Operators

- \+x (identity)
- \-x (negation)
- x% (percentage)
- x! (factorial)
- (x)d (degree)

#### Unary Functions

- abs(x) (absolute value)
- floor(x) (floor)
- ceil(x) (ceil)
- round(x) (round)
- sqrt(x) (square root)
- exp(x) (exponential)
- Ln(x) (natural log)
- log(x) (log base 10)
- sin(x) (sin radians)
- cos(x) (cos radians)
- tan(x) (tan radians)
- asin(x) (arcsin)
- acos(x) (arccos)
- atan(x) (arctan)
- Gamma(x) (gamma function)

#### Binary Operators

- a \+ b (addition)
- a \- b (subtract)
- a \* b (multiplication)
- a / b (division)
- a // b (integer division)
- a \*\* b (power)
- a ^ b (power alias)
- a mod b (modulo)

#### Binary Functions

- (a) min (b) (minimum)
- (a) max (b) (maximum)
- (n) P (r) (permutation)
- (n) C (r) (combination)
- (n) gcd (r) (integer gcd)

> It is worth noting that in some cases brackets are not needed e.g. (x)d and
> xd, nPr and (n)P(r). However, this is not always the case.

### Notes

This naive project implemented when I knew nothing of parsing theory is nowhere
near smart or performant. A stack-based modified (to support custom definitions)
LL recursive descent parser could have done a better job.

There was a plan for a new version, by writing a runtime lexer-parser generator
called [XFLIP](https://github.com/wavim/xflip). It's now abandoned after
deliberate considerations to focus on other fields. I admit that I'm not
especially interested in parsing theory.

The current version, albeit dumb, does work and function correctly in most
situations (postfix unary operators are known to have precedence issues, but I
don't really want to fix the old codebase).

Crappy, isn't it?
