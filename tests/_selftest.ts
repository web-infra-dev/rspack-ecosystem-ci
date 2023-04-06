import path from 'path'
import fs from 'fs'
import { runInRepo } from '../utils'
import { RunOptions } from '../types'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'web-infra-dev/rspack-ecosystem-ci',
		build: async () => {
			const dir = path.resolve(options.workspace, 'rspack-ecosystem-ci')
			const pkgFile = path.join(dir, 'package.json')
			const pkg = JSON.parse(await fs.promises.readFile(pkgFile, 'utf-8'))
			if (pkg.name !== 'rspack-ecosystem-ci') {
				throw new Error(
					`invalid checkout, expected package.json with "name":"rspack-ecosystem-ci" in ${dir}`,
				)
			}
			pkg.scripts.selftestscript =
				"[ -d ../../rspack/packages/rspack/dist ] || (echo 'rspack build failed' && exit 1)"
			await fs.promises.writeFile(
				pkgFile,
				JSON.stringify(pkg, null, 2),
				'utf-8',
			)
		},
		test: 'pnpm run selftestscript',
		verify: false,
	})
}
