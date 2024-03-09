import {Text, useInput} from 'ink';
import React, {useCallback, useMemo, useState} from 'react';
import {Col, Row} from './Components/Structure.js';
import {Terminal} from './Components/Terminal.js';
import {LineInput} from './Components/LineInput.js';
import {MessageFeed} from './Components/MessageFeed.js';

type Option = {control: string; display: string; component: React.ReactNode};

const noModule: Option = {control: 'NULL', display: 'None', component: <></>};

export const Catalog = () => {
	const [active, setActive] = useState<Option>(noModule);
	const [debug, setDebug] = useState(false);
	const [rawInput, setRawInput] = useState('');
	const pop = useCallback(() => setActive(noModule), [setActive]);

	useInput((input, key) => {
		setRawInput(
			key.escape
				? '[ESC]'
				: key.return
				? '[RETURN]'
				: key.backspace
				? '[BACKSPACE]'
				: key.downArrow
				? '[DOWN]'
				: key.upArrow
				? '[UP]'
				: key.leftArrow
				? '[LEFT]'
				: key.rightArrow
				? '[RIGHT]'
				: key.delete
				? '[DELETE]'
				: key.tab
				? '[TAB]'
				: input,
		);

		if (key.escape) {
			if (active.display === 'None') {
				throw new Error('Goodbye :D');
			}
			pop();
		} else if (input === 'd' && active.display === 'None') {
			setDebug(!debug);
		} else {
			if (active.display === 'None') {
				options.forEach(row =>
					row.forEach(opt => {
						if (opt.control === input) {
							setActive(opt);
						}
					}),
				);
			}
		}
	});

	const options: Option[][] = useMemo(
		() => [
			[
				{
					control: 'q',
					display: 'Terminal',
					component: <Terminal debug={debug} />,
				},
				{control: 'w', display: 'SelectionGrid', component: <></>},
			],
			[
				{
					control: 'a',
					display: 'LineInput',
					component: <LineInput debug={debug} memorySize={10} />,
				},
			],
			[
				{
					control: 'z',
					display: 'MessageFeed',
					component: (
						<MessageFeed
							debug={debug}
							messages={[1, 2, 3, 4, 5].map(n => ({
								value: `message ${n}`,
								type: 'warning',
							}))}
						/>
					),
				},
			],
		],
		[debug],
	);

	return (
		<Col>
			<Row paddingBottom={1}>
				<Text backgroundColor={'green'}>
					{`Active: ${active.display} (ESC to return) (d)ebug=${debug} rawInput=${rawInput}`}
				</Text>
			</Row>
			{active.display === 'None'
				? options.map((row, idx) => {
						return (
							<Row key={idx}>
								{row.map((opt, idx) => (
									<Text key={idx}>
										{opt.control + ') ' + opt.display.padEnd(15)}
									</Text>
								))}
							</Row>
						);
				  })
				: active.component}
		</Col>
	);
};
