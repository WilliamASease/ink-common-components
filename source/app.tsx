import React from 'react';
import {Box} from 'ink';
import {AnyFlags, Result} from 'meow';
import {SplashScreen} from './SplashScreen.js';
import {Catalog} from './Catalog.js';

export default function App(_props: {cli: Result<AnyFlags>}) {
	return (
		<Box
			flexDirection="column"
			borderColor={'green'}
			borderStyle={'classic'}
			padding={1}
			height={20}
			width={100}
		>
			<SplashScreen>
				<Catalog />
			</SplashScreen>
		</Box>
	);
}
