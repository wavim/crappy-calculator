/**
 * Math function implementations to back registry
 */
export namespace Functions {
	const APPROX_FACTORIAL_THRESHOLD = 100;

	export function factorial(x: number): number {
		if (x === Infinity) return Infinity;
		if (x >= 0 && x < APPROX_FACTORIAL_THRESHOLD && Number.isInteger(x)) {
			let factorial = 1;
			for (let n = 2; n < x + 1; n++) factorial *= n;
			return factorial;
		}
		return gammaLanczosApprox(x + 1);
	}

	export function gamma(z: number): number {
		return factorial(z - 1);
	}

	function gammaLanczosApprox(z: number): number {
		const g = 7;
		const c = [
			0.99999999999980993, 676.5203681218851, -1259.1392167224028,
			771.32342877765313, -176.61502916214059, 12.507343278686905,
			-0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
		];

		if (z < 0.5) {
			return Math.PI / (Math.sin(Math.PI * z) * gammaLanczosApprox(1 - z));
		}
		z--;
		let x = c[0];
		for (let i = 1; i < g + 2; i++) x += c[i] / (z + i);
		const t = z + g + 0.5;

		const p = Math.pow(t, z + 0.5);
		if (p === Infinity) return Infinity;

		return Math.sqrt(2 * Math.PI) * p * Math.exp(-t) * x;
	}

	export function permutation(n: number, r: number): number {
		return factorial(n) / factorial(n - r);
	}

	export function combination(n: number, r: number): number {
		return permutation(n, r) / factorial(r);
	}

	export function gcd(a: number, b: number): number {
		if (!Number.isInteger(a) || !Number.isInteger(b)) return NaN;

		while (b !== 0) {
			if (a > b) [a, b] = [b, a];
			b = b % a;
		}

		return a;
	}
}
