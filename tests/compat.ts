import { runInRepo } from '../utils'
import { RunOptions } from '../types'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'web-infra-dev/rspack-compat',
		branch: 'main',
		test: ['build', 'test'],
	})
}
