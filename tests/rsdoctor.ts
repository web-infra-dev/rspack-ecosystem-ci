import { runInRepo, $ } from '../utils'
import { RunOptions } from '../types'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'web-infra-dev/rsdoctor',
		branch: process.env.RSDOCTOR ?? 'main',
		beforeTest: async () => {
			await $`pnpm playwright install --with-deps`
		},
		test: ['test:all'],
	})
}
