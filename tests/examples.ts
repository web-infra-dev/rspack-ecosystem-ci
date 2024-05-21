import { runInRepo } from '../utils'
import { RunOptions } from '../types'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'rspack-contrib/rspack-examples',
		branch: 'main',
		test: ['build:rspack'],
	})
}
