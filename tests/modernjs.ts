import { runInRepo, cd, $ } from '../utils'
import { RunOptions } from '../types'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'web-infra-dev/modern.js',
		branch: 'main',
		beforeTest: async () => {
			cd('tests/e2e/builder')
			await $`pnpm playwright install chromium`
			cd('../../../')
		},
		test: ['test:rspack'],
	})
}
