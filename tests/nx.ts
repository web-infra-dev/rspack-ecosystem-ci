import { runInRepo, $ } from '../utils'
import { RunOptions } from '../types'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'nrwl/nx',
		branch: 'master',
		beforeTest: async () => {
			await $`cargo build`
			await $`pnpm nx reset`
			await $`pnpm nx build rspack --skip-nx-cache --verbose`
		},
		test: [
			'pnpm nx test rspack --skip-nx-cache --verbose',
			// 'pnpm nx run-many -t e2e-local -p e2e-rspack --skip-nx-cache',
		],
	})
}
