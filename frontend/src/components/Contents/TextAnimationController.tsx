import React, { useRef } from 'react';
import { useSplitTextAnimation } from '../../hooks/useSplitTextAnimation';

interface Props {
  children: React.ReactNode;
}

export function TextAnimationController({ children }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  // フックを適用（DOMがマウントされた後に動作する）
  useSplitTextAnimation(wrapperRef);

  return <div ref={wrapperRef}>{children}</div>;
}
