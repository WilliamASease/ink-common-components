import {Box, Text} from 'ink';
import React, {ReactNode, useEffect, useMemo, useState} from 'react';

export const SplashScreen = (props: {children: ReactNode}) => {
	const {children} = props;

	const [count, setCount] = useState(0);
	useEffect(() => {
		if (count < 100) {
			setTimeout(() => setCount(prev => prev + 1), 50);
		}
	}, [count]);

	const splash = useMemo(
		() => `
 # #    # #    #     ####   ####  #    # #####   ####  #    # ###### #    # #####  ####  
 # ##   # #   #     #    # #    # ##  ## #    # #    # ##   # #      ##   #   #   #      
 # # #  # ####      #      #    # # ## # #    # #    # # #  # #####  # #  #   #    ####  
 # #  # # #  #      #      #    # #    # #####  #    # #  # # #      #  # #   #        # 
 # #   ## #   #     #    # #    # #    # #      #    # #   ## #      #   ##   #   #    # 
 # #    # #    #     ####   ####  #    # #       ####  #    # ###### #    #   #    ####  
                     
 ${'William Sease 2024'.slice(0, count)}`,
		[count],
	);

	return (
		<Box flexDirection="column">
			{count < 50 ? <Text color="green">{splash}</Text> : children}
		</Box>
	);
};
