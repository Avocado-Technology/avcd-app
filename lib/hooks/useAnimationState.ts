import { useState, useCallback, useRef, useEffect } from "react";
import { ANIMATION_DURATIONS } from "../animation-constants";

interface AnimationState {
  recentChanges: Set<string>;
  highlightedNodes: Set<string>;
  markAsRecent: (nodeId: string, duration?: number) => void;
  highlightNode: (nodeId: string, duration?: number) => void;
  clearAll: () => void;
}

export function useAnimationState(): AnimationState {
  const [recentChanges, setRecentChanges] = useState<Set<string>>(new Set());
  const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(
    new Set(),
  );
  
  // Track all active timeouts to clean them up on unmount
  const timeoutsRef = useRef<Set<NodeJS.Timeout>>(new Set());

  // Cleanup all timeouts on unmount
  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps -- must read latest timeouts at unmount
      const timeouts = timeoutsRef.current;
      timeouts.forEach(clearTimeout);
      timeouts.clear();
    };
  }, []);

  const markAsRecent = useCallback((nodeId: string, duration: number = ANIMATION_DURATIONS.recent) => {
    setRecentChanges((prev) => new Set(Array.from(prev).concat(nodeId)));

    const timeoutId = setTimeout(() => {
      setRecentChanges((prev) => {
        const next = new Set(prev);
        next.delete(nodeId);
        return next;
      });
      // Remove from tracked timeouts after it completes naturally
      timeoutsRef.current.delete(timeoutId);
    }, duration);
    
    // Track the timeout
    timeoutsRef.current.add(timeoutId);
  }, []);

  const highlightNode = useCallback(
    (nodeId: string, duration: number = ANIMATION_DURATIONS.highlight) => {
      setHighlightedNodes((prev) => new Set(Array.from(prev).concat(nodeId)));

      const timeoutId = setTimeout(() => {
        setHighlightedNodes((prev) => {
          const next = new Set(prev);
          next.delete(nodeId);
          return next;
        });
        // Remove from tracked timeouts after it completes naturally
        timeoutsRef.current.delete(timeoutId);
      }, duration);
      
      // Track the timeout
      timeoutsRef.current.add(timeoutId);
    },
    [],
  );

  const clearAll = useCallback(() => {
    // Clear all pending timeouts
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current.clear();
    
    // Clear the state
    setRecentChanges(new Set());
    setHighlightedNodes(new Set());
  }, []);

  return {
    recentChanges,
    highlightedNodes,
    markAsRecent,
    highlightNode,
    clearAll,
  };
}
