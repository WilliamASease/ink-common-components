import React, {ReactNode} from 'react';
import {CommonComponentProps} from './types.js';
import {Switcher} from './Switcher.js';
import {Col} from './Structure.js';
import {Text} from 'ink';

type Obj = {key: string; data: any};

type DebuggerProps = CommonComponentProps & {
	objects?: Obj[];
	children?: ReactNode;
};

export const Debugger = (props: DebuggerProps) => {
	const {debug = false, objects, children} = props;

	return debug ? (
		<Switcher
			sections={[
				{
					display: 'Debugger',
					component: objects?.map(obj => (
						<Col>
							<Text>{obj.key}</Text>
							<Text>{JSON.stringify(obj.data)}</Text>
						</Col>
					)),
				},
				{display: 'Component', component: children},
			]}
			textColor="red"
			selectedBackgroundColor="redBright"
			paddingUnderSwitcher={1}
			initialSelection={1}
		/>
	) : (
		children
	);
};
