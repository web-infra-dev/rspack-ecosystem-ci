import { runInRepo } from '../utils'
import { RunOptions } from '../types'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'mandarini/nx-rspack-example',
		branch: 'main',
		build: 'build-ci',
		test: ['test-ci', 'e2e-ci'],
	})
}
