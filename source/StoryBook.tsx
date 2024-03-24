import React, {ReactNode, useCallback, useMemo, useState} from 'react';
import {Terminal, TerminalSubmissionFunction} from './Components/Terminal.js';
import {LineInput} from './Components/LineInput.js';
import {MessageFeed} from './Components/MessageFeed.js';
import {SelectionGrid} from './Components/SelectionGrid.js';
import {Switcher} from './Components/Switcher.js';
import {ScrollingSelectionList} from './Components/ScrollingSelectionList.js';
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

type ScrollingSelectionList = {
	name: string;
	description?: string;
};
export const ScrollingSelectionListStory = () => {
	const [hovering, setHovering] = useState<SelectionGridStoryItem>();
	const [selected, setSelected] = useState<SelectionGridStoryItem>();
	const items = useMemo(
		() => new Array(20).fill(0).map((_i, idx) => ({name: `${idx}`})),
		[],
	);
	return (
		<>
			<ScrollingSelectionList<SelectionGridStoryItem>
				debug
				items={items}
				onHover={setHovering}
				onSelect={setSelected}
				getText={(toGet?: SelectionGridStoryItem) => toGet?.name ?? ''}
				findInitialIndex={useCallback(
					(item: SelectionGridStoryItem) => item.name === '8',
					[],
				)}
			/>
			<Text>----</Text>
			<Text>
				hovering over {hovering?.name ?? ''} selected: {selected?.name ?? ''}
			</Text>
		</>
	);
};

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
