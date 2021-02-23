import * as React from 'react';


/* --------
 * Component Interfaces
 * -------- */
interface InvisibleContentProps extends React.HTMLAttributes<HTMLDivElement> {

}


/* --------
 * Internal Style
 * -------- */
const invisibleContentStyle: React.CSSProperties = {
  position: 'absolute',
  width   : '1px',
  height  : '1px',
  padding : '0px',
  margin  : '-1px',
  overflow: 'hidden',
  clip    : 'rect(0px, 0px, 0px, 0px)',
  border  : 'none'
};


/* --------
 * Component Definition
 * -------- */
const InvisibleContent: React.FunctionComponent<InvisibleContentProps> = (props) => {

  const { children, style, ...rest } = props;

  return (
    <div style={{ ...style, ...invisibleContentStyle }} {...rest}>
      {children}
    </div>
  );
};

InvisibleContent.displayName = 'InvisibleContent';

export default InvisibleContent;
