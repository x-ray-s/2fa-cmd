#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import App from './app.js';
import chalk from 'chalk';
import {decode} from './import.js';
import {add, remove, has, find, importGA, rename} from './storage.js';
import {verify} from './2fa.js';
const cli = meow(
	`
	Usage
	  $ 2fa <input>

	Input
	  add - Add a new secret
	  remove - Remove a secret
	  verify - verify a token
	  import - Import a secret from url

	Options
		--name <The name of the secret>
		--secret <Your secret>
		--token <Your token>
		--url <The URL parsed by QR code exported from Google Authenticator>

	Examples
	  $ 2fa
	  $ 2fa add --name github --secret FCRJQZSGFD3VMZDE
	  $ 2fa remove --name github
	  $ 2fa verify --name github --token 643223
	  $ 2fa import --url 'otpauth://totp/...'
	  $ 2fa rename <old> --name <new>
`,
	{
		importMeta: import.meta,
		flags: {
			secret: {
				type: 'string',
			},
			name: {
				type: 'string',
			},
			token: {
				type: 'string',
			},
			url: {
				type: 'string',
			},
		},
	},
);
const setError = (msg: string) => {
	console.log(chalk.red(msg));
};
(async function () {
	const {name, secret, url, token} = cli.flags;

	if (cli.input.includes('import')) {
		if (!url) {
			setError('When import 2fa, url is required');
			return process.exit(1);
		}

		const gaData = await decode(url);
		await importGA(gaData);
		return process.exit(0);
	}

	if (cli.input.includes('add')) {
		if (!name || !secret) {
			setError('When add a OTP, name and secret are required');
			return process.exit(1);
		}
		if (await has(name)) {
			setError('This name is already used');
			return process.exit(1);
		}
		await add({
			name: name,
			secret: secret,
		});
		return process.exit(0);
	}

	if (cli.input.includes('remove')) {
		if (!name) {
			setError('When remove a OTP, name is required');
			return process.exit(1);
		}
		await remove(name);
		return process.exit(0);
	}
	if (cli.input.includes('verify')) {
		if (!name || !token) {
			setError('When verify a OTP, name and token are required');
			return process.exit(1);
		}
		const item = await find(name);
		if (!item) {
			setError('This name is not found');
			return process.exit(1);
		}

		console.log(
			verify(item.secret, token)
				? chalk.green('Valid token')
				: chalk.red('Invalid token'),
		);
		return process.exit(0);
	}

	if (cli.input.includes('rename')) {
		const old = cli.input[1];
		if (!name || !old) {
			setError('When rename a OTP, old name and new name are required');
			return process.exit(1);
		}
		if (!(await has(old))) {
			setError('This name is not found');
			return process.exit(1);
		}
		await rename(old, name);
		return process.exit(0);
	}
})();

const {clear} = render(<App />, {
	exitOnCtrlC: false,
});

export {clear};
