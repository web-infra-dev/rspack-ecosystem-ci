import { runInRepo } from '../utils'
import { RunOptions } from '../types'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'web-infra-dev/modern.js',
		branch: 'main',
		test: ['test:e2e', 'cd ./tests/e2e/builder && pnpm run test'],
	})
}
