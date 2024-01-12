/**
 * @author Bugra Karaaslan, 500830631, This is a submitButton component.
 */
import { Button, ButtonProps } from '@chakra-ui/react';

interface ComponentProps extends ButtonProps {  
  label: string;
}

export function SubmitButton({ children, label, color, ...props }: ComponentProps) {
  return (
    <Button
      aria-label={label}
      sx={{
        cursor: 'pointer',
        userSelect: 'none',
        fontWeight: 'medium',
        fontSize: 'xs',
        bg: color || 'yellow',
        color: color || 'black',
        hover: 'none',
        minWidth:'135px',
        height: '45px',
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
