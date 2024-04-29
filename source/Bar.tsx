import React from 'react';
import {Text} from 'ink';
import {counter} from './2fa.js';

type Props = {
	max?: number;
	current: number;
};

const getString = (current = 0, max = 10) => {
	const chars = '█'.repeat(current);

	return chars + ' '.repeat(max - current);
};

const Bar = (props: Props) => {
	return <Text>|{getString(props.current, props.max)}|</Text>;
};

export const useTimeused = (max = 30) => {
	const [countdown, setCountdown] = React.useState(0);
	React.useEffect(() => {
		const timer = setInterval(() => {
			const step = counter();
			setCountdown(max - step);
		}, 1000);

		return () => {
			clearInterval(timer);
		};
	}, []);
	return countdown;
};

export default Bar;
