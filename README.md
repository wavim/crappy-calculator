### Crappy Calculator

[See notes](#notes).

A web calculator that supports custom defined constants, unary operators (functions) and binary
operators (functions).

The calculator logic is implemented with a tokenizer (lexer), a LL parser and an evaluator, without
the help of generator tools.

> It is worth noting that I had no prior knowledge on parsing theory when I wrote this, this is
> completely written from scratch.

- The tokenizer is responsible for lexing the input string into lexical tokens with a Deterministic
  Pushdown Automaton (basically, with a stack/lookbehind).
- The ad hoc left-most derivation parser is responsible for constructing an Abstract Syntax Tree
  from the tokens.
- The evaluator is responsible for recursively evaluating the tree to get the final expression
  value.

> The evaluator ultimately relies on JS, and is thus prone to all precision errors in JS.

Brackets in the calculator are always ( and ), with numerals essentially anything:  
1, 2.3, 0.05, 7.4e10, 10E-8, 0.1e+2 etc.  
All spaces would be ignored on tokenization (unless it breaks something apart e.g. cos → c os, of
course!), add them if you like.

New constants, unary operators (functions) and binary operators (functions) can be defined in no
time inside a registry, specifying some details for them (e.g. precedence for binary operators).

> Binary operators (functions) of the same precedence are left associative e.g. 1-2+3 = ((1-2)+3).  
> Unary operators (functions) are right associative e.g. -4! = (-(4!)).

> Check the files in src/calculator/registry/, the code should be self-explanatory.

> Items symbols registered are CASE SENSITIVE.

To check out the calculator, click on the GitHub Page under the repository description :D

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
- exp(x) (exponentiation base $e$)
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

> It is worth noting that in some cases brackets () are not needed e.g. (x)d and xd, nPr and
> (n)P(r), are the same.  
> However, this is not always the case, and brackets should be preferred to avoid ambiguity.  
> If not, expressions like -1^0.5 = NaN can be confusing as you might think it is equivalent to
> -(1^0.5), but it is actually interpreted as (-1)^0.5.

You can also define your own items, or mess around with the existing. (Switching '+'s with '-'s is
evilly fun)

Remember to play with the demo!

### Notes

This naive project implemented when I knew nothing of parsing theory is nowhere near performant. A
simpler LL recursive descent parser could have done a better job.

There was a thought for a new version, by writing a runtime lexer-parser generator called
[XFLIP](https://github.com/wavim/xflip). It's now abandoned after deliberate considerations. Pity. I
admit that I'm not especially interested in parsing theory.

Do note that the current version, albeit dumb, does work and function correctly. Just some regrets
in my heart that I would not be able to make it the thing I wished, crappy, isn't it? That's all.
