import React, {useCallback} from 'react';
import {Col} from './Structure.js';
import {MessageFeed, useMessageFeed} from './MessageFeed.js';
import {LineInput} from './LineInput.js';
import {Debugger} from './Debugger.js';
import {CommonComponentProps} from './types.js';

type TerminalProps = CommonComponentProps & {};

export const Terminal = (props: TerminalProps) => {
	const {debug} = props;
	const {messages, pushMessage} = useMessageFeed({
		initialMessages: [{type: 'normal', value: 'React Ink Terminal Exmaple'}],
	});

	const onSubmit = useCallback(
		(submission: string) => {
			pushMessage({type: 'normal', value: submission});
		},
		[pushMessage],
	);

	return (
		<Debugger debug={debug} objects={[{key: 'messages', data: messages}]}>
			<Col>
				<MessageFeed messages={messages} />
				<LineInput onSubmit={onSubmit} />
			</Col>
		</Debugger>
	);
};
