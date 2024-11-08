import { runInRepo, $ } from '../utils'
import { RunOptions } from '../types'

async function restoreProcessEnv(task: () => Promise<any>) {
	const initialProcessEnv = process.env
	process.env = {
		...initialProcessEnv,
		TEST_ENV: 'built',
		TEST_BUILDER: 'rspack',
		TEST_MANIFEST: 'manifest-on',
		TEST_CONTEXT: 'async',
		TEST_PAYLOAD: 'json',
		SKIP_BUNDLE_SIZE: 'true',
	}
	await task()
	process.env = initialProcessEnv
}

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'nuxt/nuxt',
		branch: 'main',
		beforeTest: async () => {
			await $`pnpm playwright-core install chromium`
		},
		test: async () => {
			await restoreProcessEnv(async () => {
				await $`pnpm test:fixtures`
			})
		},
	})
}
