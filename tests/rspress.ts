import { runInRepo, $ } from '../utils'
import { RunOptions } from '../types'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'web-infra-dev/rspress',
		branch: 'main',
		beforeTest: async () => {
			await $`pnpm playwright install`
		},
		test: ['test'],
	})
}
