import { runInRepo } from '../utils'
import { RunOptions } from '../types'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'nrwl/nx-labs',
		branch: 'main',
		build: [
			'yarn nx reset',
			'yarn nx build --skip-nx-cache rspack'
		],
		test: [
			'yarn nx test --skip-nx-cache rspack',
			'yarn nx e2e --skip-nx-cache rspack-e2e',
		],
	})
}
