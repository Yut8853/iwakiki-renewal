import type { RefObject } from 'react';

export type UseModalLogicProps = {
  isOpen: boolean;
  onClose: () => void;
  modalRef: RefObject<HTMLElement | null>;
};
