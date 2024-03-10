import React, {ReactNode, useCallback} from 'react';
import {Terminal, TerminalSubmissionFunction} from './Components/Terminal.js';
import {LineInput} from './Components/LineInput.js';
import {MessageFeed} from './Components/MessageFeed.js';
import {SelectionGrid} from './Components/SelectionGrid.js';
import {Switcher} from './Components/Switcher.js';
import {Text} from 'ink';

export const TerminalStory = () => {
	const onSubmit: TerminalSubmissionFunction = useCallback(
		(_submission, operand, parameter) => {
			if (operand === 'help') {
				return [
					{value: '[RETURN] to submit'},
					{value: 'valid operands:'},
					{value: 'help'},
					{value: 'echo [value]'},
					{value: 'openthepodbaydoors'},
				];
			}
			if (operand === 'echo') {
				return [{value: parameter}];
			}
			if (operand === 'openthepodbaydoors') {
				return [{type: 'error', value: `I can't let you do that, Dave.`}];
			}
			return [
				{
					value: `'${operand}' isn't a command. try 'help' for a list.`,
				},
			];
		},
		[],
	);
	return (
		<Terminal
			onSubmit={onSubmit}
			delayBetweenLinePrintsInMs={50}
			inputMemory={10}
			debug
		/>
	);
};

export const LineInputStory = () => <LineInput debug memorySize={10} />;

export const MessageFeedStory = () => (
	<MessageFeed
		debug
		messages={[1, 2, 3, 4, 5].map(n => ({
			value: `message ${n}`,
			type: 'warning',
		}))}
	/>
);

type SelectionGridStoryItem = {
	name: string;
	description?: string;
};
export const SelectionGridStory = () => (
	<SelectionGrid<SelectionGridStoryItem>
		debug
		itemsInRow={5}
		items={new Array(20).fill(0).map((_i, idx) => ({name: `${idx}`}))}
		onSelect={() => {}}
		getText={(toGet?: SelectionGridStoryItem) => toGet?.name ?? ''}
		getTitle={(toGet: SelectionGridStoryItem) => toGet?.name ?? ''}
		getDescription={(toGet: SelectionGridStoryItem) => toGet.description ?? ''}
	/>
);

export const SwitcherStory = () => (
	<Switcher
		sections={new Array(4).fill(0).map((_i, idx) => ({
			display: `${idx}`,
			component: (<Text>{`Component at index ${idx}`}</Text>) as ReactNode,
		}))}
		textColor="red"
		selectedBackgroundColor="redBright"
	/>
);
