import { useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './ContactModal.module.scss';
import type { ContactModalProps } from './ContactModal.types';
import { useModalLogic } from '../../hooks/useModalLogic';

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useModalLogic({ isOpen, onClose, modalRef });

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.overlay}>
      {/* 背景クリックで閉じる */}
      <button
        className={styles.bg}
        onClick={onClose}
        aria-label="モーダルを閉じる"
      />

      {/* モーダル本体 */}
      <div
        ref={modalRef}
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
        tabIndex={-1}
        onClick={e => e.stopPropagation()}
      >
        <button className={styles.close} onClick={onClose} aria-label="閉じる">
          ×
        </button>

        <h2 id="contact-modal-title" className={styles.title}>
          お問い合わせ
        </h2>

        <div className={styles.form}>
          <p>住まい探しや売却、空き家・相続のことなど、お気軽にご相談ください。</p>
          <a href="tel:0246608875">0246-60-8875</a>
          <p>営業時間：9:00〜18:00<br />定休日：毎週水曜日、他週1日</p>
          <a href="mailto:osawa@iwakiki.co.jp">osawa@iwakiki.co.jp</a>
          <a href="/contact/" className={styles.submit}>
            お問い合わせページへ
          </a>
        </div>
      </div>
    </div>,
    document.body
  );
}
