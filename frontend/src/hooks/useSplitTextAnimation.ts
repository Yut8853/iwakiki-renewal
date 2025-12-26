// useSplitTextAnimation.ts
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const useSplitTextAnimation = (
  wrapperRef: React.RefObject<HTMLElement | null>
) => {
  useEffect(() => {
    if (!wrapperRef.current) return;

    const init = async () => {
      try {
        const mod = await import('../libs/SplitText');
        const SplitText = mod.default;
        gsap.registerPlugin(SplitText);

        const rows = wrapperRef.current?.querySelectorAll('.text-row');
        if (!rows) return;

        rows.forEach((row, i) => {
          const targets = row.querySelectorAll('.text-content');
          const st = new SplitText(targets, {
            type: 'chars',
            charsClass: 'char',
          });

          gsap.from(st.chars, {
            opacity: 0,
            filter: 'blur(10px)',
            y: 20,
            stagger: 0.02,
            duration: 1,
            ease: 'power2.out',
            delay: i * 0.2,
          });
        });
      } catch (e) {
        console.error(e);
      }
    };

    init();
  }, []); // wrapperRefはマウント後に確定するので空配列でOK
};
