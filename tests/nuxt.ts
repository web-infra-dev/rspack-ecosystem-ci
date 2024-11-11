import { runInRepo, $, execa } from '../utils'
import { RunOptions } from '../types'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'nuxt/nuxt',
		branch: 'main',
		build: ['dev:prepare', 'build'],
		beforeTest: async () => {
			await $`pnpm playwright-core install chromium`
		},
		test: async () => {
			let initialProcessEnv = process.env
			const env = {
				...initialProcessEnv,
				TEST_ENV: 'built',
				TEST_BUILDER: 'rspack',
				TEST_MANIFEST: 'manifest-on',
				TEST_CONTEXT: 'async',
				TEST_PAYLOAD: 'json',
				SKIP_BUNDLE_SIZE: 'true',
			}
			// echo the TEST_BUILDER env var to confirm that it's set
			await execa('echo $TEST_BUILDER && pnpm run test:fixtures', {
				env,
				shell: true,
			})
		},
	})
}
