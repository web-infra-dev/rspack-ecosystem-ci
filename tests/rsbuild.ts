import { runInRepo, $, cd } from '../utils'
import { RunOptions } from '../types'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'web-infra-dev/rsbuild',
		branch: 'main',
		beforeTest: async () => {
			cd('./e2e')
			await $`pnpm playwright install`
		},
		test: ['test:rspack'],
	})
}
