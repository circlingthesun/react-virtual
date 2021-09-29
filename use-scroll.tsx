import React from 'react';
import useIsomorphicLayoutEffect from './use-isomorphic-layout-effect';

export default function useScroll(nodeRef, onChange) {
  const [element, setElement] = React.useState(nodeRef.current);
  const onChangeRef = React.useRef(null);
  onChangeRef.current = onChange;

  useIsomorphicLayoutEffect(() => {
    if (nodeRef.current !== element) {
      setElement(nodeRef.current);
    }
  });

  useIsomorphicLayoutEffect(() => {
    if (element && onChangeRef.current) {
      const isWindow = element === window;
      onChangeRef.current({
        scrollLeft: isWindow ? window.scrollX : element.scrollLeft,
        scrollTop: isWindow ? window.scrollY : element.scrollTop,
      });
    }
  }, [element]);

  React.useEffect(() => {
    if (!element) {
      return;
    }

    const handler = (e) => {
      if (onChangeRef.current) {
        const isWindow = element === window;
        onChangeRef.current({
          scrollLeft: isWindow ? window.scrollX : e.target.scrollLeft,
          scrollTop: isWindow ? window.scrollY : e.target.scrollTop,
        });
      }
    };

    element.addEventListener('scroll', handler, {
      capture: false,
      passive: true,
    });

    return () => {
      element.removeEventListener('scroll', handler);
    };
  }, [element]);
}
