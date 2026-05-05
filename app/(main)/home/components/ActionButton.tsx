import styles from '@/app/(main)/home/components/ActionButton.module.css';
import Image from 'next/image';
import Link from 'next/link';

type ActionButtonProps = {
  text: string;
  url: string;
  icon: string;
};

export default function ActionButton({ text, url, icon }: ActionButtonProps) {
  return (
    <Link className={styles.buttonText} href={url}>
      <div className={styles.button}>
        <Image src={icon} alt={`${text} icon`} width={48} height={48} />
        {text}
      </div>
    </Link>
  );
}
