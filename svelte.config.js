import adapter from '@sveltejs/adapter-static';

/**
 * IMPORTANT — GitHub Pages project sites are served from a sub-path
 * (https://<user>.github.io/<repo>/). We read that sub-path from the
 * BASE_PATH env var at build time so the app works both locally (BASE_PATH="")
 * and once deployed (BASE_PATH="/ilovequote" or whatever your repo is named).
 * See README.md for exact deploy instructions.
 */
const base = process.env.BASE_PATH ?? '';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			// SPA mode: everything is served through this single fallback file,
			// so GitHub Pages (a static host) can serve/refresh any in-app "screen".
			fallback: 'index.html',
			precompress: false,
			strict: true
		}),
		paths: {
			base
		}
	}
};

export default config;
