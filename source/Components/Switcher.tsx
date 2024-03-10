import {ReactNode, useState} from 'react';
import {CommonComponentProps} from './types.js';
import {useInput, Text} from 'ink';
import {Col, Row} from './Structure.js';
import React from 'react';

type SwitcherProps = CommonComponentProps & {
	sections: {display: string; component: ReactNode}[];
	initialSelection?: number;
	paddingUnderSwitcher?: number;
	textColor?: string;
	selectedBackgroundColor?: string;
};

export const Switcher = (props: SwitcherProps) => {
	const {
		sections,
		initialSelection = 0,
		paddingUnderSwitcher = 0,
		textColor = 'green',
		selectedBackgroundColor = 'greenBright',
	} = props;

	const [active, setActive] = useState(initialSelection);
	useInput((_input, key) => {
		if (key.tab) {
			setActive(prev => (prev + 1) % sections.length);
		}
	});

	return (
		<Col>
			<Row paddingBottom={paddingUnderSwitcher}>
				{sections.map((section, key) => (
					<Text
						key={key}
						color={textColor}
						backgroundColor={
							active === key ? selectedBackgroundColor : undefined
						}
					>{`${section.display} `}</Text>
				))}
				<Text>(Switch with TAB)</Text>
			</Row>
			{sections[active]?.component}
		</Col>
	);
};
