import cache from '@actions/cache'
import { execSync } from 'node:child_process'
import { join } from 'node:path'
import { runInRepo, cd, $ } from '../utils'
import { RunOptions } from '../types'

const isGitHubActions = !!process.env.GITHUB_ACTIONS

export async function test(options: RunOptions) {
	let nxCachePath: string
	let nxCacheKey: string

	await runInRepo({
		...options,
		repo: 'web-infra-dev/modern.js',
		branch: process.env.MODERN_REF ?? 'main',
		beforeInstall: async () => {
			if (isGitHubActions) {
				process.env.ACTIONS_RUNNER_DEBUG = 'true'
				const modernJsDir = join(process.cwd(), 'workspace/modernjs/modern.js')
				nxCachePath = join(modernJsDir, '.nx/cache')
				nxCacheKey =
					'modernjs-nx-' +
					execSync('git rev-parse HEAD', {
						cwd: modernJsDir,
					})
						.toString()
						.trim()
				const restoreKeys = ['modernjs-nx-']
				await cache.restoreCache([nxCachePath], nxCacheKey, restoreKeys)
			}
		},
		afterInstall: async () => {
			if (isGitHubActions) {
				await cache.saveCache([nxCachePath], nxCacheKey)
			}
		},
		beforeTest: async () => {
			cd('tests/e2e/builder')
			await $`pnpm playwright install --with-deps chromium`
			cd('../../../')
		},
		test: ['test:rspack'],
	})
}
