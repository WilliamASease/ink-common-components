import React, {useCallback} from 'react';
import {Terminal, TerminalSubmissionFunction} from './Components/Terminal.js';
import {LineInput} from './Components/LineInput.js';
import {MessageFeed} from './Components/MessageFeed.js';
import {SelectionGrid} from './Components/SelectionGrid.js';

export const TerminalStory = () => {
	const onSubmit: TerminalSubmissionFunction = useCallback(
		(_submission, operand, parameter) => {
			if (operand === 'help') {
				return [
					{type: 'normal', value: '[RETURN] to submit'},
					{type: 'normal', value: 'valid operands:'},
					{type: 'normal', value: 'help'},
					{type: 'normal', value: 'echo [value]'},
					{type: 'normal', value: 'openthepodbaydoors'},
				];
			}
			if (operand === 'echo') {
				return [{type: 'normal', value: parameter}];
			}
			if (operand === 'openthepodbaydoors') {
				return [{type: 'error', value: `I can't let you do that, Dave.`}];
			}
			return [
				{
					type: 'normal',
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
