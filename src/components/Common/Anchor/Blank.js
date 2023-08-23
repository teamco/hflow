import React from 'react';

export const AnchorBlank = props => {
  const {
    href,
    target = '_blank',
    rel = 'noreferrer',
    children,
    ...rest
  } = props;

  return (
      <a {...rest}
         href={href}
         rel={rel}
         target={target}>
        {children}
      </a>
  );
};