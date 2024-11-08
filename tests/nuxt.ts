import { runInRepo, $ } from '../utils'
import { RunOptions } from '../types'

let initialProcessEnv;
export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'nuxt/nuxt',
		branch: 'main',
		beforeTest: async () => {
			initialProcessEnv = process.env;
			process.env = {
				...initialProcessEnv,
				TEST_ENV: 'built',
				TEST_BUILDER: 'rspack',
				TEST_MANIFEST: 'manifest-on',
				TEST_CONTEXT: 'async',
				TEST_PAYLOAD: 'json',
				SKIP_BUNDLE_SIZE: 'true',
			}
			await $`pnpm playwright-core install chromium`
		},
		test: ['test:fixtures'],
	})
}
