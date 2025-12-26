import { useEffect } from 'react';
import type { UseModalLogicProps } from './useModalLogic.types';

export function useModalLogic({
  isOpen,
  onClose,
  modalRef,
}: UseModalLogicProps) {
  useEffect(() => {
    if (!isOpen) return;

    // 1. 開いた瞬間のフォーカスを保存
    const lastFocused = document.activeElement as HTMLElement | null;

    // 2. スクロール抑止
    document.body.style.overflow = 'hidden';

    // 3. モーダルにフォーカス
    setTimeout(() => modalRef.current?.focus(), 0);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // クリーンアップ
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
      lastFocused?.focus();
    };
  }, [isOpen, onClose, modalRef]);
}
