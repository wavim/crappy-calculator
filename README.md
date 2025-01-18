So I was basically mad at a friend who used `eval()` to write his calculator. (Jokes)

The calculator logic part is composed of a lexer (tokenizer), a parser and an evaluator.  
The lexer scans the input and returns lexical tokens (with slight modifications under some contexts),
after which the parser parses the tokens and returns an Abstract Syntax Tree.
Finally, the evaluator recursively evaluates the final value of the tree.

> Sometimes the calculator gives results like 13.00000001,
> that is due to JS floating point arithmetic precision issues.
> (Basically, not my fault!)

To check out the calculator, just click on the GitHub Page under the repo description :D
