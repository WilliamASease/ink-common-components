import {Text, useInput} from 'ink';
import React, {useEffect, useMemo, useState} from 'react';
import pkg from 'lodash';
const {isNil} = pkg;
import {CommonComponentProps} from './types.js';
import {Debugger} from './Debugger.js';
import {Col} from './Structure.js';

type ScrollingSelectionListProps<T> = CommonComponentProps & {
	onSelect?: (selection?: T) => void;
	onHover?: (selection?: T) => void;
	getText: (toGet?: T) => string;
	items?: T[];
	getItems?: () => Promise<T[]>;
	visibleRows?: number;
	initialIndex?: number;
	findInitialIndex?: (check: T) => boolean;
};

export function ScrollingSelectionList<T>(
	props: ScrollingSelectionListProps<T>,
) {
	const {
		debug,
		items,
		getItems,
		onHover,
		onSelect,
		getText,
		visibleRows = 7,
		initialIndex,
		findInitialIndex,
	} = props;

	const [itemList, setItemList] = useState<T[]>([]);
	const [padItemDisplay, setPadItemDisplay] = useState(0);
	const [pos, setPos] = useState<number>(0);

	useEffect(() => {
		const getItemsCompiled = async () => {
			if (!isNil(items)) return items;
			if (!isNil(getItems)) return await getItems();
			return [];
		};
		getItemsCompiled()
			.then(trueItems => {
				let maxDisplayNameLength = 0;
				trueItems.forEach((item, idx) => {
					if (maxDisplayNameLength < getText(item).length) {
						maxDisplayNameLength = getText(item).length;
					}
					if (!isNil(findInitialIndex) && findInitialIndex(item)) {
						setPos(idx);
					}
				});
				setPadItemDisplay(maxDisplayNameLength + 1);
				setItemList(trueItems);
				if (!isNil(initialIndex)) {
					setPos(initialIndex);
				}
			})
			.catch(() => {});
	}, [items, getItems, findInitialIndex]);

	useInput((_input, key) => {
		if (key.upArrow) {
			let newVal = pos - 1;
			if (newVal < 0) {
				newVal = itemList.length - 1;
			}
			setPos(newVal);
		} else if (key.downArrow) {
			let newVal = (pos + 1) % itemList.length;
			setPos(newVal);
		} else if (key.return && !isNil(onSelect)) {
			onSelect(hoveringItem);
		}
	});

	const hoveringItem = useMemo(() => itemList[pos], [pos, itemList]);
	useEffect(() => {
		if (!isNil(onHover)) {
			onHover(hoveringItem);
		}
	}, [onHover, hoveringItem]);
	const [lowerBound, upperBound] = useMemo(() => {
		if (itemList.length < visibleRows) {
			return [0, itemList.length];
		}
		let boundModifier = visibleRows / 2;
		let lowerBound = pos - Math.floor(boundModifier);
		let upperBound = pos + Math.ceil(boundModifier);
		if (visibleRows % 2 === 1) {
			upperBound -= 0;
		}
		if (lowerBound < 0) {
			upperBound -= lowerBound;
			lowerBound = 0;
		} else if (upperBound >= itemList.length) {
			lowerBound = itemList.length - visibleRows;
			upperBound = itemList.length;
		}
		return [lowerBound, upperBound];
	}, [visibleRows, pos, itemList.length]);

	return (
		<Debugger
			debug={debug}
			objects={[
				{key: 'itemGrid', data: itemList},
				{key: 'padItemDisplay', data: padItemDisplay},
				{key: 'hoveringItem', data: hoveringItem},
				{key: 'pos', data: pos},
				{key: 'bounds', data: [lowerBound, upperBound]},
			]}
		>
			<Col>
				{itemList
					.map((col, rowidx) => (
						<Text
							key={rowidx}
							backgroundColor={rowidx === pos ? 'green' : undefined}
						>
							{rowidx === lowerBound && rowidx !== 0
								? '↑ '
								: rowidx === upperBound - 1 && rowidx !== itemList.length - 1
								? '↓ '
								: '  '}
							{`${getText(col)}`.padEnd(padItemDisplay)}
						</Text>
					))
					.slice(lowerBound, upperBound)}
			</Col>
		</Debugger>
	);
}
