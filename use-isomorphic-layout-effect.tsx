import React from 'react';

// console.log({ isBrowser: typeof window !== 'undefined' });

export default typeof window !== 'undefined'
  ? React.useLayoutEffect
  : React.useEffect;

// export default React.useEffect;
