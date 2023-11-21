import { runInRepo } from '../utils'
import { RunOptions } from '../types'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'nrwl/nx-labs',
		branch: 'main',
		build: ['yarn nx build rspack'],
		test: ['yarn nx test rspack', 'yarn nx e2e rspack-e2e'],
	})
}
