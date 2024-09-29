import { runInRepo, $ } from '../utils'
import { RunOptions } from '../types'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'nrwl/nx',
		branch: 'master',
		beforeTest: async () => {
			await $`cargo build`
			await $`pnpm run build --skip-nx-cache --verbose`
		},
		test: [
			'pnpm nx test --skip-nx-cache rspack --verbose',
			// 'pnpm nx run-many -t e2e-local -p e2e-rspack --skip-nx-cache',
		],
	})
}
