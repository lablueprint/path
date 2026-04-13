import Link from 'next/link';
import styles from './ActionButton.module.css';

type ActionButtonProps = {
  text: string;
  url: string;
};

export default function ActionButton({ text, url }: ActionButtonProps) {
  return (
    <Link className={styles.buttonText} href={url}>
      <div className={styles.button}>{text}</div>
    </Link>
  );
}
