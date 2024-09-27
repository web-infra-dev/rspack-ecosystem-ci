import { runInRepo, $ } from '../utils'
import { RunOptions } from '../types'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'nrwl/nx',
		branch: 'master',
		build: ['pnpm nx build --skip-nx-cache rspack'],
		beforeTest: async () => {
			await $`cargo build`
			await $`pnpm run build`
		},
		test: [
			'pnpm nx test --skip-nx-cache rspack',
			// 'pnpm nx run-many -t e2e-local -p e2e-rspack --skip-nx-cache',
		],
	})
}
