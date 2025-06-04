import { defineConfig } from "vite";

import { ViteMinifyPlugin } from "vite-plugin-minify";

export default defineConfig({
	server: {
		port: 3000,
	},
	build: {
		emptyOutDir: true,
		outDir: "docs",
		target: "esnext",
		minify: true,
		cssMinify: true,
	},
	css: {
		preprocessorOptions: {
			scss: {
				api: "modern-compiler",
			},
		},
	},
	base: "",
	plugins: [ViteMinifyPlugin()],
});
