import { runInRepo, $ } from '../utils'
import { RunOptions } from '../types'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'nrwl/nx',
		branch: 'master',
		beforeTest: async () => {
			await $`cargo build`
			await $`NX_DAEMON=false pnpm run build --skip-nx-cache`
		},
		test: [
			'NX_DAEMON=false pnpm nx test --skip-nx-cache rspack',
			// 'pnpm nx run-many -t e2e-local -p e2e-rspack --skip-nx-cache',
		],
	})
}
