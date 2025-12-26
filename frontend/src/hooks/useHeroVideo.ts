import { useState, useCallback } from 'react';

export function useHeroVideo(videoList: string[]) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleEnded = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % videoList.length);
  }, [videoList.length]);

  return {
    currentIndex,
    currentVideo: videoList[currentIndex],
    handleEnded,
  };
}
