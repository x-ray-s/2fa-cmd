import {JSONFilePreset} from 'lowdb/node';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type Item = {
	name: string;
	secret: string;
};

export type Data = {
	items: Item[];
};

const data: Data = {
	items: [],
};

const file = path.resolve(__dirname, './2fa-db.json');

const db = await JSONFilePreset(file, data);

export const add = async (item: Item) => {
	db.data.items.push(item);
	await db.write();
};

export const remove = async (name: string) => {
	db.data.items = db.data.items.filter(item => item.name !== name);
	await db.write();
};

export const list = async () => {
	await db.read();
	return db.data.items;
};

export const has = async (name: string) => {
	await db.read();
	return db.data.items.findIndex(item => item.name === name) !== -1;
};
export const find = async (name: string) => {
	await db.read();
	return db.data.items.find(item => item.name === name);
};
type GoogleAuthenticatorItem = {
	name: string;
	totpSecret: string;
	type: string;
};
export const importGA = async (items: GoogleAuthenticatorItem[]) => {
	const storaged = await list();
	const queue = items
		.filter(item => {
			return (
				item.type === 'OTP_TOTP' &&
				!storaged.find(storagedItem => storagedItem.secret === item.totpSecret)
			);
		})
		.map(item => {
			return add({
				name: item.name + '-imported',
				secret: item.totpSecret,
			});
		});
	await Promise.all(queue);
};
