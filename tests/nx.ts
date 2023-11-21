import { runInRepo } from '../utils'
import { RunOptions } from '../types'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'nrwl/nx-labs',
		branch: 'main',
		build: ['NX_SKIP_NX_CACHE=true yarn nx build rspack'],
		test: [
			'NX_SKIP_NX_CACHE=true yarn nx test rspack',
			'NX_SKIP_NX_CACHE=true yarn nx e2e rspack-e2e',
		],
	})
}
