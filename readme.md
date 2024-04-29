# 2fa-cmd

Google Authenticator or other OTP application in command.

![screenshot](screenshot.png)

## Install

```bash
$ npm install --global 2fa-cmd
```

## CLI

```
$ 2fa --help

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
	  $ 2fa import --url otpauth://totp/...
```

## TODO

[] password
[] encrypto
[] custom storage path
