import cache from '@actions/cache'
import { execSync } from 'node:child_process'
import { join } from 'node:path'
import { runInRepo, cd, $ } from '../utils'
import { RunOptions } from '../types'

function getCurrentCommitSha() {
	return execSync('git rev-parse HEAD').toString().trim()
}

export async function test(options: RunOptions) {
	const nxCachePath = join(__dirname, 'workspace/modernjs/modern.js')
	let nxCacheKey = 'modernjs-nx-'

	await runInRepo({
		...options,
		repo: 'web-infra-dev/modern.js',
		branch: process.env.MODERN_REF ?? 'main',
		beforeInstall: async () => {
			nxCacheKey += getCurrentCommitSha()
			const restoreKeys = ['modernjs-nx-']
			await cache.restoreCache([nxCachePath], nxCacheKey, restoreKeys)
		},
		afterInstall: async () => {
			await cache.saveCache([nxCachePath], nxCacheKey)
		},
		beforeTest: async () => {
			cd('tests/e2e/builder')
			await $`pnpm playwright install --with-deps chromium`
			cd('../../../')
		},
		test: ['test:rspack'],
	})
}
