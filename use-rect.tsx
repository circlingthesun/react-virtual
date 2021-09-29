import React from 'react';
import observeRect from '@reach/observe-rect';
import useIsomorphicLayoutEffect from './use-isomorphic-layout-effect';

const getBoundingRect = (element) => {
  if (element === window) {
    return {
      bottom: window.scrollY + window.innerHeight,
      height: window.innerHeight,
      left: window.scrollX,
      right: window.scrollX + window.innerWidth,
      top: window.scrollY,
      width: window.innerWidth,
    };
  }
  return element.getBoundingClientRect();
};

export default function useRect(nodeRef) {
  const [element, setElement] = React.useState(nodeRef.current);
  const [rect, dispatch] = React.useReducer(rectReducer, null);
  const initialRectSet = React.useRef(false);

  useIsomorphicLayoutEffect(() => {
    if (nodeRef.current !== element) {
      setElement(nodeRef.current);
    }
  });

  useIsomorphicLayoutEffect(() => {
    if (element && !initialRectSet.current) {
      initialRectSet.current = true;
      const rect = getBoundingRect(element);
      dispatch({ rect });
    }
  }, [element]);

  React.useEffect(() => {
    if (!element) {
      return;
    }

    const observer = observeRect(
      element === window
        ? {
            getBoundingClientRect: () => getBoundingRect(element),
          }
        : element,
      (rect) => {
        dispatch({ rect });
      }
    );

    observer.observe();

    return () => {
      observer.unobserve();
    };
  }, [element]);

  return rect;
}

function rectReducer(state, action) {
  const rect = action.rect;
  if (!state || state.height !== rect.height || state.width !== rect.width) {
    return rect;
  }
  return state;
}
