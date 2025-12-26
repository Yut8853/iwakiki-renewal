import styles from './Hero.module.scss';
import { useHeroVideo } from '../../hooks/useHeroVideo';
import type { HeroVideoProps } from './HeroVideo.types';

const VIDEO_LIST = [
  '/videos/AdobeStock_561715243.mp4',
  '/videos/AdobeStock_564226576.mp4',
  '/videos/AdobeStock_564226647.mp4',
];

export default function HeroVideo({ onVideoChange }: HeroVideoProps) {
  const { currentVideo, handleEnded } = useHeroVideo(VIDEO_LIST);

  return (
    <video
      key={currentVideo}
      className={styles.heroVideo}
      src={currentVideo}
      autoPlay
      muted
      playsInline
      onEnded={() => {
        handleEnded();
        onVideoChange?.(currentVideo);
      }}
    />
  );
}
