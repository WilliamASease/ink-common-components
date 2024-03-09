import React, {useState} from 'react';
import {Row} from './Structure.js';
import {useInput, Text} from 'ink';
import {CommonComponentProps} from './types.js';
import {Debugger} from './Debugger.js';

type LineInputProps = {
	linePrefix?: string;
	memorySize?: number;
	onSubmit?: (submission: string) => void;
} & CommonComponentProps;

export const LineInput = (props: LineInputProps) => {
	const {linePrefix = '>', memorySize = 0, onSubmit = () => {}, debug} = props;

	const [memoryList, setMemoryList] = useState<string[]>([]);
	const [memoryListIndex, setMemoryListIndex] = useState(0);
	const [line, setLine] = useState('');

	useInput((input, key) => {
		if (key.return) {
			if (line.length > 0) {
				let newMemoryList = memoryList;
				if (newMemoryList.length === memorySize) {
					newMemoryList = newMemoryList.slice(1);
				}
				if (newMemoryList.length < memorySize) {
					newMemoryList = newMemoryList.concat(line);
				}
				setMemoryList(newMemoryList);
				setMemoryListIndex(newMemoryList.length - 1);
				onSubmit(line);
				setLine('');
			}
		} else if (key.upArrow) {
			let fetchedMemory = memoryList[memoryListIndex];
			if ((fetchedMemory ?? '').length > 0 && memoryListIndex >= 0) {
				setLine(fetchedMemory ?? '');
				setMemoryListIndex(memoryListIndex - 1);
			}
		} else if (key.downArrow) {
			let fetchedMemory = memoryList[memoryListIndex + 1];
			if ((fetchedMemory ?? '').length > 0) {
				setLine(fetchedMemory ?? '');
				setMemoryListIndex(memoryListIndex + 1);
			}
		} else if (key.backspace) {
			setLine(line.slice(0, line.length - 1));
		} else if (key.delete) {
			setLine(line.slice(1, line.length));
		} else {
			setLine(prev => prev + input);
		}
	});

	return (
		<Debugger
			debug={debug}
			objects={[
				{key: 'memoryList', data: memoryList},
				{key: 'memoryListIndex', data: memoryListIndex},
				{key: 'line', data: line},
			]}
		>
			<Row>
				<Text>
					{linePrefix}
					{line}
				</Text>
			</Row>
		</Debugger>
	);
};
