import {Box, Text, useInput} from 'ink';
import React, {useEffect, useMemo, useState} from 'react';
import pkg from 'lodash';
const {isNil} = pkg;
import {CommonComponentProps} from './types.js';
import {Debugger} from './Debugger.js';

type SelectionGridProps<T> = CommonComponentProps & {
	itemsInRow: number;
	onSelect: (selection?: T) => void;
	getText: (toGet?: T) => string;
	getTitle?: (toGet: T) => string;
	getDescription?: (toGet: T) => string;
	items?: T[];
	getItems?: () => Promise<T[]>;
};

export function SelectionGrid<T>(props: SelectionGridProps<T>) {
	const {
		debug,
		itemsInRow,
		items,
		getItems,
		onSelect,
		getText,
		getTitle,
		getDescription,
	} = props;

	const [itemGrid, setItemGrid] = useState<T[][]>([]);
	const [padItemDisplay, setPadItemDisplay] = useState(0);
	useEffect(() => {
		const getItemsCompiled = async () => {
			if (!isNil(items)) return items;
			if (!isNil(getItems)) return await getItems();
			return [];
		};
		getItemsCompiled()
			.then(trueItems => {
				let out: T[][] = [];
				for (let i = 0; i < trueItems.length; i += itemsInRow) {
					out.push(trueItems.slice(i, i + itemsInRow));
				}
				setItemGrid(out);
				let maxDisplayNameLength = 0;
				trueItems.forEach(item => {
					if (maxDisplayNameLength < getText(item).length) {
						maxDisplayNameLength = getText(item).length;
					}
				});
				setPadItemDisplay(maxDisplayNameLength + 1);
			})
			.catch(() => {});
	}, [items, itemsInRow, getItems]);

	const [pos, setPos] = useState<[number, number]>([0, 0]);
	useInput((_input, key) => {
		if (key.upArrow) {
			setPos(prev => {
				let newidx = (prev[1] - 1) % itemsInRow;
				if (newidx < 0) {
					newidx = (itemGrid ?? []).length - 1;
				}
				return [prev[0], newidx];
			});
		} else if (key.rightArrow) {
			setPos(prev => [(prev[0] + 1) % itemsInRow, prev[1]]);
		} else if (key.downArrow) {
			setPos(prev => [prev[0], (prev[1] + 1) % itemGrid.length]);
		} else if (key.leftArrow) {
			setPos(prev => {
				let newidx = (prev[0] - 1) % itemsInRow;
				if (newidx < 0) {
					newidx = itemsInRow - 1;
				}
				return [newidx, prev[1]];
			});
		} else if (key.return) {
			onSelect(hoveringItem);
		}
	});

	const hoveringItem = useMemo(
		() => (itemGrid[pos[1]] ?? [])[pos[0]],
		[pos, itemGrid],
	);

	return (
		<Debugger
			debug={debug}
			objects={[
				{key: 'itemGrid', data: itemGrid},
				{key: 'padItemDisplay', data: padItemDisplay},
				{key: 'hoveringItem', data: hoveringItem},
				{key: 'pos', data: pos},
			]}
		>
			<Box flexDirection="column">
				<Text>{'nav: up/down/left/right select: enter'}</Text>
				{itemGrid.map((row, rowidx) => (
					<Box key={rowidx}>
						{row.map((col, colidx) => (
							<Text
								key={colidx}
								backgroundColor={
									rowidx === pos[1] && colidx === pos[0] ? 'green' : undefined
								}
							>
								{`${getText(col)}`.padEnd(padItemDisplay)}
							</Text>
						))}
						{new Array(itemsInRow - row.length).fill(0).map((_i, idx) => (
							<Text
								key={idx}
								backgroundColor={
									rowidx === pos[1] && idx + row.length === pos[0]
										? 'green'
										: undefined
								}
							>
								{''.padEnd(padItemDisplay)}
							</Text>
						))}
					</Box>
				))}
				<Box flexDirection="column" paddingTop={1}>
					{hoveringItem && (!isNil(getTitle) || isNil(getDescription)) && (
						<>
							{!isNil(getTitle) && <Text>{getTitle(hoveringItem)}</Text>}
							{!isNil(getDescription) && (
								<Text>{getDescription(hoveringItem)}</Text>
							)}
						</>
					)}
				</Box>
			</Box>
		</Debugger>
	);
}
