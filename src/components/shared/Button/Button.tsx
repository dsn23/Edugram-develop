/**
 * @author Bugra Karaaslan, 500830631, This is a Button component.
 */
import { Button, ButtonProps } from '@chakra-ui/react';

interface ComponentProps extends ButtonProps {  
  label: string;
}

export function ActionButton({ children, label, color, ...props }: ComponentProps) {
  return (
    <Button
      aria-label={label}
      sx={{
        cursor: 'pointer',
        userSelect: 'none',
        fontWeight: 'medium',
        fontSize: 'xs',
        bg: 'blueGreen',
        color: 'white',
        minWidth:'135px',
        height: '45px',
      }}
      _hover={{bg: 'blueGreen'}}
      {...props}
    >
      {children}
    </Button>
  );
}
