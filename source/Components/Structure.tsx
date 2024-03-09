import {Box, BoxProps} from 'ink';
import React from 'react';

export const Col = (
	props: Omit<BoxProps, 'flexDirection'> & {children?: React.ReactNode},
) => <Box flexDirection="column" {...props} />;

export const Row = (
	props: Omit<BoxProps, 'flexDirection'> & {children?: React.ReactNode},
) => <Box flexDirection="row" {...props} />;
