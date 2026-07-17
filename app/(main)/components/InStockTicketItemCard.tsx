'use client';
import { useState } from 'react';
import { updateTicketItemQuantity } from '@/app/actions/ticket';
import styles from '@/app/(main)/components/InStockTicketItemCard.module.css';
import ticketStyles from '@/app/(main)/components/TicketDetails.module.css';
import Image from 'next/image';
import imagePlaceholder from '@/public/image-placeholder.svg';
import { Form, Button } from 'react-bootstrap';

interface InStockTicketItemCardProps {
  ticketItemId: string;
  quantityRequested: number;
  quantityAvailable: number;
  itemName: string;
  photoUrl: string | null;
  subcategoryName: string;
  categoryName: string;
}

export default function InStockTicketItemCard({
  ticketItemId,
  quantityRequested,
  quantityAvailable,
  itemName,
  photoUrl,
  subcategoryName,
  categoryName,
}: InStockTicketItemCardProps) {
  const [quantity, setQuantity] = useState(quantityRequested);
  const [savedQuantity, setSavedQuantity] = useState(quantityRequested);
  const [errorMessage, setErrorMessage] = useState('');

  const hasChanged = quantity !== savedQuantity;

  const handleSave = async () => {
    if (quantity < 1) {
      setErrorMessage('Please input a number greater than 0.');
      return;
    }

    const result = await updateTicketItemQuantity(ticketItemId, quantity);

    if (!result.success) {
      console.error('Error changing ticket item quantity:', result.error);
      return;
    }

    setSavedQuantity(quantity);
    setErrorMessage('');
  };

  const handleCancel = () => {
    setQuantity(savedQuantity);
    setErrorMessage('');
  };

  return (
    <div className={styles.itemCard}>
      <div>
        <Image
          className={styles.itemImage}
          src={photoUrl || imagePlaceholder}
          alt={`Picture of ${itemName}`}
          width={80}
          height={80}
          unoptimized
        />
      </div>
      <div className="container p-0 m-0">
        <div className="row row-cols-1 row-cols-sm-3 g-3">
          <div className={`col ${ticketStyles.cardTextGroup}`}>
            <p className={ticketStyles.cardTextHeading}>{itemName}</p>
            <p>{categoryName}</p>
            <p>↳ {subcategoryName}</p>
          </div>
          <div className="col">
            {quantityAvailable > 0 ? (
              <p className={styles.inStock}>{quantityAvailable} Available</p>
            ) : (
              <p className={styles.outOfStock}>0 Available</p>
            )}
          </div>
          <div className={`col ${ticketStyles.cardTextGroup}`}>
            <div className={ticketStyles.cardTextHeading}>Quantity</div>
            <div className={styles.btnContainer}>
              <Form.Group>
                <Form.Control
                  id="quantity"
                  name="quantity"
                  type="number"
                  min={1}
                  isInvalid={!!errorMessage}
                  value={quantity}
                  onChange={(e) => {
                    setQuantity(Number(e.target.value));
                    setErrorMessage('');
                  }}
                  className={`form-control-sm ${styles.quantityInput}`}
                />
                <Form.Control.Feedback type="invalid">
                  {errorMessage}
                </Form.Control.Feedback>
              </Form.Group>
              {hasChanged && (
                <div className={styles.btnContainer}>
                  <Button className="btn-submit" size="sm" onClick={handleSave}>
                    Save
                  </Button>
                  <Button
                    className="btn-cancel"
                    size="sm"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
