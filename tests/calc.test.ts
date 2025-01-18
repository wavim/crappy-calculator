import { calculate } from "../src/calc/calc";

describe("Testing calculate()", () => {
	test("Basic Operations", () => {
		expect(calculate("1 + 1")).toBe(2);
		expect(calculate("5 - 3")).toBe(2);
		expect(calculate("4 * 2")).toBe(8);
		expect(calculate("8 / 2")).toBe(4);
		expect(calculate("2 ^ 3")).toBe(8);
	});

	test("Mixed Operations", () => {
		expect(calculate("1 + 2 * 3")).toBe(7);
		expect(calculate("(1 + 2) * 3")).toBe(9);
		expect(calculate("10 - 2 / 2")).toBe(9);
		expect(calculate("2 + 3 * (4 - 1) ^ 2")).toBe(29);
	});

	test("Negative Numbers", () => {
		expect(Math.abs(calculate("-1 + 1"))).toBe(0);
		expect(calculate("-1 - 1 + 1")).toBe(-1);
		expect(calculate("-5 - 5")).toBe(-10);
		expect(calculate("-2 * 3")).toBe(-6);
		expect(calculate("-6 / 2")).toBe(-3);
		expect(calculate("(-2) ^ 3")).toBe(-8);
	});

	test("Edge Cases", () => {
		expect(calculate("5 / 0")).toBe(Infinity);
		expect(calculate("0 ^ 5")).toBe(0);
		expect(calculate("1 ^ 100")).toBe(1);
		expect(calculate("-1 ^ 0.5")).toBe(NaN);
	});

	test("Bracket Usage", () => {
		expect(calculate("((2 + 3) * (4 - 1))")).toBe(15);
		expect(calculate("((1 + 2) * (3 + 4)) / 2")).toBe(10.5);
		expect(calculate("-2(1 + 3)")).toBe(-8);
	});

	test("Scientific Notation", () => {
		expect(calculate("1e3 + 2e+2")).toBe(1200);
		expect(calculate("2e-1 - 2.2e3")).toBe(-2199.8);
	});

	test("Decimal Numbers", () => {
		expect(calculate("1.5 + 2.5")).toBe(4.0);
	});

	test("Complex Expression with All Operations", () => {
		expect(calculate("((1 + 2) * 3 - 4) / (2 ^ 2)")).toBe(1.25);
	});
});
