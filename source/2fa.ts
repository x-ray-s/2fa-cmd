import {authenticator} from 'otplib';

export const counter = () => {
	return authenticator.timeUsed();
};
export const generate = (secret?: string) => {
	if (!secret) {
		secret = authenticator.generateSecret();
	}
	const token = authenticator.generate(secret);
	return {
		secret,
		token,
	};
};

export const verify = (secret: string, token: string) => {
	return authenticator.verify({token, secret});
};
