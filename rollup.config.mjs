import deletePlugin from "rollup-plugin-delete";

import terserPlugin from "@rollup/plugin-terser";
import dtsPlugin from "rollup-plugin-dts";
import ts2Plugin from "rollup-plugin-typescript2";

export default [
	{
		input: "src/index.ts",
		output: { file: "dist/index.esm.js", format: "esm" },

		plugins: [
			deletePlugin({ targets: "dist", runOnce: true }),

			ts2Plugin({ useTsconfigDeclarationDir: true }),
			terserPlugin(),
		],

		watch: true,
	},
	{
		input: "src/index.ts",
		output: { file: "dist/index.js", format: "cjs" },

		plugins: [
			ts2Plugin({ useTsconfigDeclarationDir: true }),
			terserPlugin(),
		],

		watch: false,
	},
	{
		input: "dist/types/index.d.ts",
		output: [{ file: "dist/index.d.ts", format: "es" }],

		plugins: [dtsPlugin()],

		watch: true,
	},
];
