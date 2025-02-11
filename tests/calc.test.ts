import { Calculator } from "../src/calculator/calculator";

function run(input: string, value: number): void {
	expect(Calculator.value(input)).toBe(value);
}

describe("calculator test", () => {
	test("constans", () => {
		run("E", Math.E);
		run("PI", Math.PI);
	});

	test("unary operators", () => {
		run("+1", 1);
		run("-1", -1);
		run("-(1-2)", 1);
		run("4!", 24);
		run("(4+1)!", 120);
	});
	test("unary operators (mixed)", () => {
		run("+-1", -1);
		run("--1", 1);
		run("3!!", 720);
		run("---3!!", -720);
	});

	test("unary functions", () => {
		run("abs-3", 3);
		run("cosPI", -1);
		run("LnE", 1);
		run("Ln(E^3)", 3);
		run("log100", 2);
		run("round0.5", 1);
		run("floor0.5", 0);
	});
	test("unary functions (mixed)", () => {
		run("logabs-3", Math.log10(3));
		run("tancosPI", Math.tan(-1));
		run("LnLnE", 0);
		run("tanLn3!", Math.tan(Math.log(6)));
	});

	test("binary operators", () => {
		run("2+3", 5);
		run("2-3", -1);
		run("2*3", 6);
		run("2/3", 2 / 3);
		run("3//2", 1);
		run("2**3", 8);
		run("2^3", 8);
		run("2%3", 2);
	});
	test("binary operators (mixed)", () => {
		run("2+3-1", 4);
		run("2-3*4", -10);
		run("2*3-1", 5);
		run("2/(3+2)", 2 / 5);
		run("2*2^3+1", 17);
		run("2*(2^3+1)", 18);
		run("(2+4)%3*5", 0);
	});

	test("complex expressions", () => {
		run(
			"1+2*(3-4E)min(LnPI)-(5/6)^7%8",
			1 + 2 * Math.min(3 - 4 * Math.E, Math.log(Math.PI)) - ((5 / 6) ** 7 % 8),
		);
	});
});
