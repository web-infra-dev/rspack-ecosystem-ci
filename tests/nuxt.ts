import { runInRepo, $ } from '../utils'
import { RunOptions } from '../types'
import { execaCommand } from 'execa'

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
			await execaCommand('pnpm run test:fixtures', {
				shell: true,
				env,
				stdout: 'inherit',
				stderr: 'inherit',
				stdin: 'inherit',
			})
		},
	})
}
