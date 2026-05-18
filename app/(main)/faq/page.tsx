import styles from '@/app/(main)/faq/FaqPage.module.css';

const roleCards = [
  {
    title: 'Default User',
    description:
      'Assigned automatically to all new accounts. Can view home page and submit Gift-in-Kind receipts.',
  },
  {
    title: 'Requestor',
    description:
      'Can browse stores, submit item requests (tickets), view team directory, and edit their own profile.',
  },
  {
    title: 'Store Admin',
    description:
      'Manages one or more specific stores. Can process tickets, update inventory, and manage store admins for their assigned store(s). Can view global inventory library and categories. Can manage requestors.',
  },
  {
    title: 'Superadmin',
    description:
      'Manages all stores. Can edit global inventory library and categories. Can view and export Gift-in-Kind receipts.',
  },
  {
    title: 'Owner',
    description: 'The highest privilege level. Can manage superadmins.',
  },
];

const statusCards = [
  {
    title: 'Requested',
    description: 'Your ticket has been submitted for a store admin to review.',
  },
  {
    title: 'Approved',
    description:
      'A store admin has reviewed and approved your ticket. The items are being prepared for pickup or delivery.',
  },
  {
    title: 'Ready',
    description:
      'The items in your ticket have been prepared for pickup or delivery.',
  },
  {
    title: 'Fulfilled',
    description:
      'Your request has been fully completed. The items have been picked up or delivered. No further action is needed.',
  },
  {
    title: 'Rejected',
    description:
      'A store admin was unable to fulfill your request. This may be due to stock availability or other constraints.',
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
    <div>
      <h1>FAQ</h1>
      <div className={styles.content}>
        <section>
          <h2>Roles &amp; Permissions</h2>
          <p className={styles.sectionDescription}>
            Roles determine what pages you can access and what actions you can
            take. Higher roles inherit all permissions from roles below them.
          </p>

          <div className="row row-cols-1 row-cols-sm-2 g-5">
            {roleCards.map((card) => (
              <div key={card.title}>
                <FaqCard {...card} />
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2>Ticket Statuses</h2>
          <p className={styles.sectionDescription}>
            Once a ticket is submitted, tickets move through the following
            statuses as store admins review and fulfill them.
          </p>

          <div className="row row-cols-1 row-cols-sm-2 g-5">
            {statusCards.map((card) => (
              <div key={card.title}>
                <FaqCard {...card} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
