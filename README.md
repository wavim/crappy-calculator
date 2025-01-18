So I was basically mad at a friend that used `eval()` to write his calculator. (Jokes)

The calculator logic part is composed of a lexer (tokenizer), a parser and an evaluator.  
The lexer scans the input and returns lexical tokens (with slight modifications under some contexts),
after which the parser parses the tokens and returns an Abstract Syntax Tree.
Finally, the evaluator recursively evaluates the final value of the tree.

To check out the calculator (not fun, trust me), just click on the GitHub Page under the repo description :D
