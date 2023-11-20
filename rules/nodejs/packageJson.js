import * as fs from 'node:fs/promises'
import path from 'node:path';

import detectIndent from 'detect-indent'

import { makeRule, pkgRoot } from "../../util/util.js";
import { octokit } from '../../util/octokit.js';

export async function rule({ github }) {
	const { data } = await octokit.rest.repos.get({
		owner: github.owner,
		repo: github.repo,
	})

	await makeRule(async () => {
		const packageJsonText = await fs.readFile('package.json', 'utf-8')
		/** @type {import('type-fest').PackageJson} */
		const packageJson = JSON.parse(packageJsonText)

		return {
			description: 'package.json must have accurate: description',
			async shouldFix() {
				return data.description !== packageJson.description
			},
			async fix() {
				let packageJsonModified = {
					...packageJson,
					description: data.description
				}
				await fs.writeFile(
					'package.json',
					JSON.stringify(packageJsonModified, null, detectIndent(packageJsonText).indent || '\t')
				)
			}
		}
	})

	await makeRule(async () => {
		const packageJsonText = await fs.readFile('package.json', 'utf-8')
		/** @type {import('type-fest').PackageJson} */
		const packageJson = JSON.parse(packageJsonText)
		const author = 'Edwin Kofler <edwin@kofler.dev> (https://edwinkofler.com)'

		return {
			description: 'package.json must have accurate: author',
			async shouldFix() {
				return packageJson.author !== author
			},
			async fix() {
				let packageJsonModified = {
					...packageJson,
					author
				}
				await fs.writeFile(
					'package.json',
					JSON.stringify(packageJsonModified, null, detectIndent(packageJsonText).indent || '\t')
				)
			}
		}
	})

	await makeRule(async () => {
		const packageJsonText = await fs.readFile('package.json', 'utf-8')
		/** @type {import('type-fest').PackageJson} */
		const packageJson = JSON.parse(packageJsonText)

		// TODO: check license is the same
		return {
			description: 'package.json must have accurate: license',
			async shouldFix() {
				return !packageJson.license
			}
		}
	})

	await makeRule(async () => {
		const packageJsonText = await fs.readFile('package.json', 'utf-8')
		/** @type {import('type-fest').PackageJson} */
		const packageJson = JSON.parse(packageJsonText)
		const bugsUrl = `https://github.com/${github.owner}/${github.repo}/issues`

		return {
			description: 'package.json must have accurate: bugs.url',
			async shouldFix() {
				return packageJson?.bugs?.url != bugsUrl
			},
			async fix() {
				let packageJsonModified = {
					...packageJson,
					bugs: {
						url: bugsUrl
					}
				}
				await fs.writeFile(
					'package.json',
					JSON.stringify(packageJsonModified, null, detectIndent(packageJsonText).indent || '\t')
				)
			}
		}
	})

	await makeRule(async () => {
		const packageJsonText = await fs.readFile('package.json', 'utf-8')
		/** @type {import('type-fest').PackageJson} */
		const packageJson = JSON.parse(packageJsonText)
		const gitUrl = `https://github.com/${github.owner}/${github.repo}.git`

		return {
			description: 'package.json must have accurate: repository',
			async shouldFix() {
				return packageJson?.repository?.url !== gitUrl
			},
			async fix() {
				let packageJsonModified = {
					...packageJson,
					repository: {
						type: 'git',
						url: gitUrl
					}
				}
				await fs.writeFile(
					'package.json',
					JSON.stringify(packageJsonModified, null, detectIndent(packageJsonText).indent || '\t')
				)
			}
		}
	})

	await makeRule(async () => {
		const packageJsonText = await fs.readFile('package.json', 'utf-8')
		/** @type {import('type-fest').PackageJson} */
		const packageJson = JSON.parse(packageJsonText)

		return {
			description: 'package.json must not have empty: keywords',
			async shouldFix() {
				return (!Array.isArray(packageJson.keywords) || packageJson.keywords.length === 0)
			}
		}
	})
}
