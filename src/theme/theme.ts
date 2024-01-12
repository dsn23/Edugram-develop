import { extendTheme } from '@chakra-ui/react';

import { colors } from './colors';
import { fontSizes, fonts } from './typograpyh';
import { globalStyle } from './global-style';
import { sizes } from './sizes';
import { breakpoints } from './breakpoints';

export const theme = extendTheme({
    colors,
    fontSizes,
    fonts,
    sizes,
    breakpoints,
    styles: { global: globalStyle }
});

export type CustomTheme = typeof theme;
