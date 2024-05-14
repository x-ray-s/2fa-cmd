import React, {useEffect} from 'react';
import {Text, Box, useInput, useApp, useStdin} from 'ink';
import Bar, {useTimeused} from './Bar.js';
import {generate} from './2fa.js';
import {list, Data} from './storage.js';
import {clear} from './cli.js';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default function App() {
	const max = 30;
	const countdown = useTimeused(max);
	const [items, setItems] = React.useState<Data['items']>([]);
	const {exit} = useApp();
	const {isRawModeSupported} = useStdin();
	useInput((input, key) => {
		if (input === 'c' && key.ctrl) {
			clear();
			exit();
		}
	});

	useEffect(() => {
		(async () => {
			// wait for the storage to be ready
			await delay(500);
			const _items = await list();
			setItems(_items.reverse());
		})();
	}, []);

	return (
		<>
			{isRawModeSupported && items.length > 0 && (
				<Box columnGap={1}>
					<Bar max={max} current={countdown} />
					<Text color="green">{countdown}</Text>
				</Box>
			)}
			{isRawModeSupported &&
				items.map((item, index) => {
					return (
						<Box key={index} marginTop={1} flexDirection="column">
							<Text>
								<Text>{item.name}</Text>
							</Text>

							<Text>
								<Text color="#005cc5" bold>
									{generate(item.secret).token}
								</Text>
							</Text>
						</Box>
					);
				})}
		</>
	);
}
