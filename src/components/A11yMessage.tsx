import * as React from 'react';
import InvisibleContent from './InvisibleContent';


/* --------
 * Component Interfaces
 * -------- */
interface A11yMessageProps {
  /** Accessibility Message */
  message?: string;
}


/* --------
 * Component Definition
 * -------- */
const A11yMessage: React.FunctionComponent<A11yMessageProps> = (props) => {

  const { message } = props;

  /** No message, no Content */
  if (!message) {
    return null;
  }

  /** Return an invisible content for Screen Reader only element */
  return (
    <InvisibleContent role={'status'} aria-live={'polite'} aria-atomic={'true'}>
      {message}
    </InvisibleContent>
  );
};

A11yMessage.displayName = 'A11yMessage';


/* --------
 * Component Memoization
 * -------- */
const MemoizedA11yMessage = React.memo(A11yMessage, (prev, next) => prev.message === next.message);

MemoizedA11yMessage.displayName = 'MemoizedA11yMessage';

export default MemoizedA11yMessage;
