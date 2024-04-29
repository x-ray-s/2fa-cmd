// copy from https://github.com/krissrex/google-authenticator-exporter
import base32 from './edbase32.js';
import protobuf from 'protobufjs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function decodeProtobuf(payload: Buffer) {
	const file = path.resolve(__dirname, './google_auth.proto');
	const root = protobuf.loadSync(file);

	const MigrationPayload = root.lookupType('googleauth.MigrationPayload');

	const message = MigrationPayload.decode(payload);

	return MigrationPayload.toObject(message, {
		longs: String,
		enums: String,
		bytes: String,
	});
}

function toBase32(base64String: string) {
	const raw = Buffer.from(base64String, 'base64');
	return base32.encode(raw);
}

const decode = (uri: string) => {
	const queryParams = new URL(uri).search;
	const data = new URLSearchParams(queryParams).get('data');
	if (data) {
		const buffer = Buffer.from(decodeURIComponent(data), 'base64');

		const payload = decodeProtobuf(buffer);

		const accounts = payload['otpParameters'].map((account: any) => {
			account.totpSecret = toBase32(account.secret);
			return account;
		});

		return accounts;
	}
};

export {decode};
