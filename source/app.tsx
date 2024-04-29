import React, {useEffect} from 'react';
import {Text, Box, useInput, useApp} from 'ink';
import Bar, {useTimeused} from './Bar.js';
import {generate} from './2fa.js';
import {list, Data} from './storage.js';
import {clear} from './cli.js';

export default function App() {
	const max = 30;
	const countdown = useTimeused(max);
	const [items, setItems] = React.useState<Data['items']>([]);
	const {exit} = useApp();
	useInput((input, key) => {
		if (input === 'c' && key.ctrl) {
			clear();
			exit();
		}
	});

	useEffect(() => {
		(async () => {
			const _items = await list();
			setItems(_items.reverse());
		})();
	}, []);

	return (
		<>
			<Box columnGap={1}>
				<Bar max={max} current={countdown} />
				<Text color="green">{countdown}</Text>
			</Box>
			{items.map((item, index) => {
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
