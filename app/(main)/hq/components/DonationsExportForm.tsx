'use client';

import { useForm, useWatch } from 'react-hook-form';
import { Form, Card } from 'react-bootstrap';
import {
  exportDonations,
  exportDonationsInRange,
} from '@/app/actions/donation';

type FormValues = {
  dateMode: 'all' | 'range';
  startDate?: string;
  endDate?: string;
};

export default function Donations() {
  const {
    register,
    control,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      dateMode: 'all',
    },
  });

  const dateMode = useWatch({
    control,
    name: 'dateMode',
  });

  const onSubmit = () => {
    handleExport();
  };

  const handleExport = async () => {
    if (dateMode === 'range') {
      const { startDate, endDate } = getValues();
      const result = await exportDonationsInRange({
        startDate: startDate || '',
        endDate: endDate || '',
      });
      const csvString = result?.data;
      const blob = new Blob([csvString || ''], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('href', url);
      a.setAttribute('download', `donations_${startDate}_to_${endDate}.csv`);
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      const result = await exportDonations();
      const csvString = result?.data;
      const blob = new Blob([csvString || ''], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('href', url);
      a.setAttribute('download', `donations.csv`);
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <Card className="form-card">
      <Card.Body>
        <h2 className="form-title-1">Export Donations</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-body">
            <Form.Group>
              <div className="radio-row">
                <Form.Check
                  type="radio"
                  label="All time"
                  value="all"
                  id="date-mode-all"
                  {...register('dateMode')}
                />
                <Form.Check
                  type="radio"
                  label="Date range"
                  value="range"
                  id="date-mode-range"
                  {...register('dateMode')}
                />
              </div>
            </Form.Group>

            {dateMode === 'range' && (
              <div className="two-col-row">
                <Form.Group controlId="startDate">
                  <Form.Label className="field-label">Start date</Form.Label>
                  <Form.Control
                    type="date"
                    {...register('startDate', {
                      required: 'Start date is required.',
                    })}
                    isInvalid={!!errors.startDate}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.startDate?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="endDate">
                  <Form.Label className="field-label">End date</Form.Label>
                  <Form.Control
                    type="date"
                    {...register('endDate', {
                      required: 'End date is required.',
                    })}
                    isInvalid={!!errors.endDate}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.endDate?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
            )}

            <div className="submit-button-row">
              <button type="submit" className="btn-submit">
                Export
              </button>
            </div>
          </div>
        </form>
      </Card.Body>
    </Card>
  );
}
