import React, {useCallback} from 'react';
import {Col} from './Structure.js';
import {Message, MessageFeed, useMessageFeed} from './MessageFeed.js';
import {LineInput} from './LineInput.js';
import {Debugger} from './Debugger.js';
import {CommonComponentProps} from './types.js';
import pkg from 'lodash';
const {isNil} = pkg;

export type TerminalSubmissionFunction = (
	process: string,
	operand: string,
	parameter: string,
) => Message[];

type TerminalProps = CommonComponentProps & {
	initialMessages?: Message[];
	onSubmit: TerminalSubmissionFunction;
	delayBetweenLinePrintsInMs?: number;
	disableAutoSubmissionPrint?: boolean;
	inputMemory?: number;
};

export const Terminal = (props: TerminalProps) => {
	const {
		debug,
		initialMessages = [],
		onSubmit,
		delayBetweenLinePrintsInMs = 0,
		disableAutoSubmissionPrint = false,
		inputMemory = 0,
	} = props;
	const {messages, pushMessage} = useMessageFeed({
		initialMessages: initialMessages,
	});

	const onSubmitWrapped = useCallback(
		async (submission: string) => {
			if (!disableAutoSubmissionPrint) {
				pushMessage({type: 'normal', value: submission});
			}
			let messages = onSubmit(
				submission,
				submission.split(' ')[0] ?? '',
				submission.split(' ').slice(1).join(' '),
			);
			for (let i = 0; i < messages.length; i++) {
				let message = messages[i];
				if (!isNil(message)) {
					await new Promise(resolve =>
						setTimeout(resolve, delayBetweenLinePrintsInMs),
					);
					pushMessage(message);
				}
			}
		},
		[pushMessage, onSubmit],
	);

	return (
		<Debugger debug={debug} objects={[{key: 'messages', data: messages}]}>
			<Col>
				<MessageFeed messages={messages} />
				<LineInput onSubmit={onSubmitWrapped} memorySize={inputMemory} />
			</Col>
		</Debugger>
	);
};
