import {Text, useInput} from 'ink';
import React, {useCallback, useState} from 'react';
import {Col} from './Components/Structure.js';
import {getRawInput} from './util/util.js';
import {
	LineInputStory,
	MessageFeedStory,
	SelectionGridStory,
	SwitcherStory,
	TerminalStory,
} from './StoryBook.js';
import {SelectionGrid} from './Components/SelectionGrid.js';
import pkg from 'lodash';
const {isNil} = pkg;

type Option = {display: string; component?: React.ReactNode};

const noModule: Option = {display: 'None'};

export const Catalog = () => {
	const [active, setActive] = useState<Option>(noModule);
	const [rawInput, setRawInput] = useState('');
	const pop = useCallback(() => setActive(noModule), [setActive]);

	useInput((input, key) => {
		setRawInput(getRawInput(input, key));

		if (key.escape) {
			if (active.display === 'None') {
				throw new Error('Goodbye :D');
			}
			pop();
		}
	});

	return (
		<Col>
			<Text backgroundColor={'green'}>
				{`Active: ${active.display} (ESC to return) rawInput=${rawInput}`}
			</Text>
			{active.component ? (
				active.component
			) : (
				<>
					<Text> </Text>
					<SelectionGrid<Option>
						itemsInRow={5}
						items={[
							{display: 'Terminal', component: <TerminalStory />},
							{display: 'MessageFeed', component: <MessageFeedStory />},
							{display: 'LineInput', component: <LineInputStory />},
							{display: 'SelectionGrid', component: <SelectionGridStory />},
							{display: 'Switcher', component: <SwitcherStory />},
						]}
						onSelect={selected => {
							if (!isNil(selected)) {
								setActive(selected);
							}
						}}
						getText={toGet => toGet?.display ?? ''}
					/>
				</>
			)}
		</Col>
	);
};
