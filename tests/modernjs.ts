import cache from '@actions/cache'
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
				const modernJsDir = join(process.cwd(), 'workspace/modernjs/modern.js')
				nxCachePath = join(modernJsDir, '.nx/cache')
				const sha = await $`git rev-parse HEAD`.toString().trim()
				nxCacheKey = 'modernjs-nx-' + sha
				const restoreKeys = ['modernjs-nx-']
				const cacheHitKey = await cache.restoreCache(
					[nxCachePath],
					nxCacheKey,
					restoreKeys,
				)
				if (cacheHitKey) {
					await $`ls -lah .nx/cache`
				}
			}
		},
		afterInstall: async () => {
			if (isGitHubActions) {
				await $`ls -lah .nx/cache`
				await cache.saveCache([`${nxCachePath}/**`], nxCacheKey)
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
