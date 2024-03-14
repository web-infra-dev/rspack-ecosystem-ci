import * as os from 'os'
import { runInRepo, cd, $ } from '../utils'
import { RunOptions } from '../types'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'web-infra-dev/modern.js',
		branch: process.env.MODERN_REF ?? 'main',
		beforeTest: async () => {
			cd('tests/e2e/builder')
			await $`pnpm playwright install --with-deps chromium`
			cd('../../../')
		},
		test: [`e2e:rspack --workers ${os.cpus().length}`],
	})
}
