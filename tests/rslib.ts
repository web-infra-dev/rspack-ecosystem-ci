import { runInRepo } from '../utils'
import { RunOptions } from '../types'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'web-infra-dev/rslib',
		branch: process.env.RSLIB ?? 'main',
		test: ['test:artifact'],
	})
}
