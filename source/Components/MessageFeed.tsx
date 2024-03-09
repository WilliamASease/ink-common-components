import React, {ReactNode, useCallback, useMemo, useState} from 'react';
import {CommonComponentProps} from './types.js';
import {Debugger} from './Debugger.js';
import {Col} from './Structure.js';
import {Text} from 'ink';

type MessageTypes = 'normal' | 'warning' | 'error';

type Message = {
	value: string;
	type: MessageTypes;
	customRender?: (value: string, type: MessageTypes) => ReactNode;
};

type MessageFeedProps = CommonComponentProps & {
	messages?: Message[];
	padToHeight?: number;
};

type useMessageFeedProps = {
	initialMessages?: Message[];
	maxMessages?: number;
};

export const MessageFeed = (props: MessageFeedProps) => {
	const {debug, messages = [], padToHeight = 10} = props;

	const padArray = useMemo(
		() => new Array(padToHeight - messages.length).fill(' '),
		[padToHeight, messages.length],
	);

	return (
		<Debugger
			debug={debug}
			objects={[
				{key: 'messages', data: messages},
				{key: 'padArray', data: padArray},
			]}
		>
			<Col>
				{padArray.map(val => (
					<Text>{val}</Text>
				))}
				{messages.map(message => {
					return (
						<Text
							color={
								message.type === 'normal'
									? 'white'
									: message.type === 'warning'
									? 'yellow'
									: message.type === 'error'
									? 'red'
									: undefined
							}
						>
							{message.value}
						</Text>
					);
				})}
			</Col>
		</Debugger>
	);
};

export const useMessageFeed = (props: useMessageFeedProps) => {
	const {initialMessages = [], maxMessages = 10} = props;

	const [messages, setMessages] = useState(initialMessages);
	const pushMessage = useCallback(
		(toPush: Message) => {
			let newMessages = messages.slice(0);
			if (messages.length === maxMessages) {
				newMessages = newMessages.slice(1);
			}
			newMessages.push(toPush);
			setMessages(newMessages);
		},
		[messages, setMessages],
	);
	const flush = useCallback(() => setMessages([]), []);

	return {
		messages: messages,
		pushMessage: pushMessage,
		flush: flush,
	};
};
