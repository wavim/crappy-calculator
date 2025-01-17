import { defineConfig } from "vite";

export default defineConfig({
	server: {
		port: 3000,
	},
	build: {
		rollupOptions: {
			input: "src/index.html",
		},
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
});
