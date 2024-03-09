import React, {ReactNode, useState} from 'react';
import {CommonComponentProps} from './types.js';
import {Col, Row} from './Structure.js';
import {Text, useInput} from 'ink';

type Obj = {key: string; data: any};

type DebuggerProps = CommonComponentProps & {
	objects?: Obj[];
	children?: ReactNode;
};

export const Debugger = (props: DebuggerProps) => {
	const {debug = false, objects, children} = props;
	const [switcher, setSwitcher] = useState<'debug' | 'component'>('debug');

	useInput((_input, key) => {
		if (key.tab) {
			setSwitcher(switcher === 'debug' ? 'component' : 'debug');
		}
	});

	if (debug === false) return children;

	return (
		<Col>
			<Row>
				<Text
					color={'red'}
					backgroundColor={switcher === 'debug' ? 'redBright' : undefined}
				>
					Debugger
				</Text>
				<Text
					color={'red'}
					backgroundColor={switcher === 'component' ? 'redBright' : undefined}
				>
					Component
				</Text>
				<Text>(Switch with TAB)</Text>
			</Row>
			{switcher === 'debug'
				? objects?.map(obj => (
						<Row>
							<Text>{obj.key}</Text>
							<Text> = </Text>
							<Text>{JSON.stringify(obj.data)}</Text>
						</Row>
				  ))
				: children}
		</Col>
	);
};
