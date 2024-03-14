import { runInRepo, $ } from '../utils'
import { RunOptions } from '../types'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'web-infra-dev/rspress',
		branch: process.env.RSPRESS_REF ?? 'main',
		beforeTest: async () => {
			await $`pnpm playwright install --with-deps`
		},
		test: ['test'],
	})
}
