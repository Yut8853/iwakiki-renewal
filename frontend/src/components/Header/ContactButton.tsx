import { useState } from 'react';
import styles from './Header.module.scss';
import { ContactModal } from '../ContactModal/ContactModal';

export default function ContactButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className={styles.contactButton}>
        お問い合わせ
      </button>

      <ContactModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
