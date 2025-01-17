import { defineConfig } from "vite";
import sassPlugin from "vite-plugin-sass";

export default defineConfig({
	plugins: [sassPlugin()],
	server: {
		port: 5200,
	},
	build: {
		emptyOutDir: true,
		target: "esnext",
		minify: true,
		cssMinify: true,
	},
});
