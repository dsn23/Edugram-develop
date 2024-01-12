import { SystemStyleObject } from '@chakra-ui/react';
import { fontSizes } from './typograpyh';

export const globalStyle: SystemStyleObject = {
  'html, body': {
  },
  body: {
    minWidth: '320px',
    fontSize: `${fontSizes.xs}`,
  },
  '*': {
    boxSizing: 'border-box', 
  },
  a: {
    textDecoration: 'none',
  },
  h1: {
    fontSize: `${fontSizes.lg}`,
    fontWeight: 'bold'
  },
  h2: {
    fontSize: `${fontSizes.md}`,
  },
};
