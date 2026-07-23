'use client';

import { ReactNode } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';

type ConfirmModalProps = {
  show: boolean;
  title?: string;
  message?: ReactNode;
  errorMessage?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export default function ConfirmModal({
  show,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  errorMessage,
  confirmText = 'Remove',
  cancelText = 'Cancel',
  isLoading = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      backdrop={isLoading ? 'static' : true}
    >
      <Modal.Header closeButton={!isLoading}>{title}</Modal.Header>

      <Modal.Body className="gap-container">
        <p>{message}</p>
        <div className="btn-row">
          <Button
            variant="outline-danger"
            className="btn-remove"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Removing...' : confirmText}
          </Button>
          <Button className="btn-cancel" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
        </div>
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      </Modal.Body>
    </Modal>
  );
}
