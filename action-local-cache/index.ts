import { setFailed, setOutput } from '@actions/core'
import { mkdirP, mv, cp, rmRF } from '@actions/io'
import { exists } from '@actions/io/lib/io-util'

import { Strategy, Vars, getVars } from './lib/getVars'
import { isErrorLike } from './lib/isErrorLike'

export class ActionLocalCache {
	#vars: Vars

	constructor(path: string, strategy?: Strategy, key?: string) {
		this.#vars = getVars(path, strategy, key)
	}

	async restore(): Promise<void> {
		try {
			const { cachePath, targetDir, targetPath, options } = this.#vars
			if (await exists(cachePath)) {
				await mkdirP(targetDir)

				switch (options.strategy) {
					case 'copy-immutable':
					case 'copy':
						await cp(cachePath, targetPath, {
							copySourceDirectory: false,
							recursive: true,
						})
						break
					case 'move':
						await mv(cachePath, targetPath, { force: true })
						break
				}

				console.log(
					`Cache found and restored to ${options.path} with ${options.strategy} strategy`,
				)
				setOutput('cache-hit', true)
			} else {
				console.log(`Skipping: cache not found for ${options.path}.`)
				setOutput('cache-hit', false)
			}
		} catch (error: unknown) {
			console.trace(error)
			setFailed(isErrorLike(error) ? error.message : `unknown error: ${error}`)
		}
	}

	async save(): Promise<void> {
		try {
			const { cacheDir, targetPath, cachePath, options } = this.#vars

			await mkdirP(cacheDir)

			switch (options.strategy) {
				case 'copy-immutable':
					if (await exists(cachePath)) {
						console.log(`Cache already exists, skipping`)
						return
					}
					await cp(targetPath, cachePath, {
						copySourceDirectory: true,
						recursive: true,
					})
					break
				case 'copy':
					await rmRF(cachePath)
					await cp(targetPath, cachePath, {
						copySourceDirectory: true,
						recursive: true,
					})
					break
				case 'move':
					await mv(targetPath, cachePath, { force: true })
					break
			}

			console.log(
				`Cache saved to ${cachePath} with ${options.strategy} strategy`,
			)
		} catch (error: unknown) {
			console.log(error)
			setFailed(isErrorLike(error) ? error.message : `unknown error: ${error}`)
		}
	}
}
