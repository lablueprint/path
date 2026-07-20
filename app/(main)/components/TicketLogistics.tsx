import styles from '@/app/(main)/components/TicketDetails.module.css';
import TicketDestStoreDropdown from '@/app/(main)/components/TicketDestStoreDropdown';
import { Store } from '@/app/types/store';

export default function TicketLogistics({
  ticketId,
  sourceStore,
  currentDestStore,
  destStoreOptions,
}: {
  ticketId: string;
  sourceStore: Store;
  currentDestStore: Store | null;
  destStoreOptions: { store: Store }[];
}) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Logistics</h2>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardTextGroup}>
          <p className={styles.cardTextHeading}>
            Source Store (Requesting From)
          </p>
          <p>{sourceStore.name}</p>
        </div>
        <div className={styles.cardTextGroup}>
          <p className={styles.cardTextHeading}>Source Store Street Address</p>
          <p>{sourceStore.street_address}</p>
        </div>
        <div className={styles.cardTextGroup}>
          <p className={styles.cardTextHeading}>
            Destination Store (Transferring To)
          </p>
          <TicketDestStoreDropdown
            ticketId={ticketId}
            currentDestStore={currentDestStore}
            destStoreOptions={destStoreOptions}
          />
        </div>
        {currentDestStore && (
          <div className={styles.cardTextGroup}>
            <p className={styles.cardTextHeading}>
              Destination Store Street Address
            </p>
            <p>{currentDestStore.street_address}</p>
          </div>
        )}
      </div>
    </div>
  );
}
