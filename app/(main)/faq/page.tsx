import styles from './FaqPage.module.css';

const roleCards = [
  {
    title: 'Default User',
    description:
      'Assigned automatically to all new accounts. Default users can view home page and submit donation forms.',
  },
  {
    title: 'Requestor',
    description:
      'Can browse stores and submit item requests (tickets). Requestors can view team directory and edit their own profile.',
  },
  {
    title: 'Store Admin',
    description:
      'Manages one or more specific stores. Can handle incoming tickets and update inventory for their assigned store(s).',
  },
  {
    title: 'Super Admin',
    description:
      'Has visibility across all stores. Can manage stores, categories, and donation records. Cannot manage other Superadmins or the Owner.',
  },
  {
    title: 'Owner',
    description:
      'The highest privilege level. Full access to all features, all stores, and all user management including Superadmins.',
  },
];

const statusCards = [
  {
    title: 'Requested',
    description:
      'Your request has been submitted and is waiting for a store admin to review it.',
  },
  {
    title: 'Ready',
    description:
      'The store admin has reviewed your ticket and the items are being prepared or set aside for pickup or delivery.',
  },
  {
    title: 'Fulfilled',
    description:
      'Your request has been fully completed. All items have been provided. No further action is needed.',
  },
  {
    title: 'Rejected',
    description:
      'The store admin was unable to fulfill this request. This may be due to stock availability or other constraints.',
  },
];

function FaqCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{title}</h3>
      </div>
      <div className={styles.cardBody}>
        <p className={styles.cardDescription}>{description}</p>
      </div>
    </article>
  );
}

export default function FaqPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>FAQ</h1>

      <div className={styles.offsetContent}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Roles &amp; Permissions</h2>
          <p className={styles.sectionDescription}>
            Roles determine what pages you can access and what actions you can take. Higher roles inherit all permissions from roles below them.
          </p>

          <div className="row g-4">
            {roleCards.map((card) => (
              <div key={card.title} className="col-12 col-xl-6">
                <FaqCard {...card} />
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Ticket Statuses</h2>
          <p className={styles.sectionDescription}>
            Once a ticket is submitted, tickets move through the following statuses as store admins review and fulfill them.
          </p>

          <div className="row g-4">
            {statusCards.map((card) => (
              <div key={card.title} className="col-12 col-xl-6">
                <FaqCard {...card} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
