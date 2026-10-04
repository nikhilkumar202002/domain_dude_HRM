import React, { useState } from 'react';
import clsx from 'clsx';

export const Tooltip = ({ content, children, position = 'top' }) => {
  const [show, setShow] = useState(false);

  if (!content) return children;

  const positions = {
    top: '-top-8 left-1/2 -translate-x-1/2',
    bottom: '-bottom-8 left-1/2 -translate-x-1/2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  };

  return (
    <div className="relative inline-flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div
          className={clsx(
            'absolute z-40 whitespace-nowrap rounded bg-slate-900 px-2 py-1 text-[10px] font-medium text-white shadow-md transition-opacity',
            positions[position]
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
};
