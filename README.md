So I was basically mad at a friend who used `eval()` to write his calculator. (Jokes)

The calculator logic part is composed of a lexer (tokenizer), a parser and an evaluator.  
The lexer scans the input and returns lexical tokens (with slight modifications under some contexts),
after which the parser parses the tokens and returns an Abstract Syntax Tree.
Finally, the evaluator recursively evaluates the final value of the tree.

> The calculator relies on JS floating point numerical calculations,
> and is thus prone to all precision errors in JS.

To check out the calculator, just click on the GitHub Page under the repo description :D
