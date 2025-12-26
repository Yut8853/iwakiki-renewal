import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './ContactModal.module.scss';
import type { ContactModalProps } from './ContactModal.types';
import { useModalLogic } from '../../hooks/useModalLogic';

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

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

        <form
          className={styles.form}
          onSubmit={e => {
            e.preventDefault();
            alert('送信処理はこれから実装！');
            onClose();
          }}
        >
          <label className={styles.field}>
            <span>お名前</span>
            <input name="name" type="text" required />
          </label>

          <label className={styles.field}>
            <span>メールアドレス</span>
            <input name="email" type="email" required />
          </label>

          <label className={styles.field}>
            <span>お問い合わせ内容</span>
            <textarea name="message" rows={4} required />
          </label>

          <button type="submit" className={styles.submit}>
            送信する
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
