import styles from '@/app/(main)/components/ActionButton.module.css';
import Image from 'next/image';
import Link from 'next/link';

type ActionButtonProps = {
  text: string;
  url: string;
  icon: string;
};

export default function ActionButton({ text, url, icon }: ActionButtonProps) {
  return (
    <Link href={url} className={styles.buttonText}>
      <div className={styles.button}>
        <Image src={icon} alt={`${text} icon`} width={48} height={48} />
        <h2>{text}</h2>
      </div>
    </Link>
  );
}
