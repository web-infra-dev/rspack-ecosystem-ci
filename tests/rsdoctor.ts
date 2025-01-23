import { runInRepo, $, cd } from '../utils'
import { RunOptions } from '../types'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'web-infra-dev/rsdoctor',
		branch: process.env.RSDOCTOR ?? 'main',
		beforeTest: async () => {
			cd('./e2e')
			await $`pnpm playwright install --with-deps`
			cd('..')
		},
		test: ['test:all'],
	})
}
