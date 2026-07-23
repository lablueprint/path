'use client';

import { useForm, useWatch } from 'react-hook-form';
import { Form, Card, Button, Alert } from 'react-bootstrap';
import {
  exportDonations,
  exportDonationsInRange,
} from '@/app/actions/donation';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useState } from 'react';

dayjs.extend(utc);
dayjs.extend(timezone);

const TARGET_TZ = 'America/Los_Angeles';

type FormValues = {
  dateMode: 'all' | 'range';
  startDate?: string;
  endDate?: string;
};

export default function Donations() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      dateMode: 'all',
      startDate: '',
      endDate: '',
    },
  });

  const [isExporting, setIsExporting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const dateMode = useWatch({ control, name: 'dateMode' });
  const watchedStartDate = useWatch({ control, name: 'startDate' });

  const handleExport = async (values: FormValues) => {
    setIsExporting(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      if (values.dateMode === 'range' && values.startDate && values.endDate) {
        const isoStart = dayjs
          .tz(values.startDate, TARGET_TZ)
          .startOf('day')
          .toISOString();
        const isoEnd = dayjs
          .tz(values.endDate, TARGET_TZ)
          .endOf('day')
          .toISOString();

        const result = await exportDonationsInRange({
          startDate: isoStart,
          endDate: isoEnd,
        });
        if (!result?.success || !result.data) {
          setErrorMessage('Failed to export donations.');
          return;
        }

        const csvString = result?.data;
        const blob = new Blob([csvString || ''], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);

        a.setAttribute(
          'download',
          `donations_${values.startDate}_to_${values.endDate}.csv`,
        );
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        const result = await exportDonations();
        if (!result?.success || !result.data) {
          setErrorMessage('Failed to export donations.');
          return;
        }

        const csvString = result?.data;
        const blob = new Blob([csvString || ''], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', `donations.csv`);
        a.click();
        window.URL.revokeObjectURL(url);
      }
      setSuccessMessage('Exported and downloaded donations.');
    } catch (error) {
      setErrorMessage('Failed to export donations: ' + error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="form-card">
      <Card.Body>
        <Form onSubmit={handleSubmit(handleExport)}>
          <div className="form-body">
            <Form.Group>
              <div className="radio-row">
                <Form.Check
                  type="radio"
                  label="All Time"
                  value="all"
                  id="date-mode-all"
                  {...register('dateMode')}
                />
                <Form.Check
                  type="radio"
                  label="Date Range"
                  value="range"
                  id="date-mode-range"
                  {...register('dateMode')}
                />
              </div>
            </Form.Group>

            {dateMode === 'range' && (
              <div className="two-col-row">
                <Form.Group controlId="startDate">
                  <Form.Label className="field-label">Start Date</Form.Label>
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
                  <Form.Label className="field-label">End Date</Form.Label>
                  <Form.Control
                    type="date"
                    {...register('endDate', {
                      required: 'End date is required.',
                      validate: (value) => {
                        if (watchedStartDate && value) {
                          const start = dayjs.tz(watchedStartDate, TARGET_TZ);
                          const end = dayjs.tz(value, TARGET_TZ);

                          if (end.isBefore(start)) {
                            return 'End date cannot come before start date.';
                          }
                        }
                        return true;
                      },
                    })}
                    isInvalid={!!errors.endDate}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.endDate?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
            )}
            <div>
              <Button
                type="submit"
                className="btn-submit"
                disabled={isExporting}
              >
                {isExporting ? 'Exporting...' : 'Export'}
              </Button>
            </div>
            {successMessage && (
              <Alert variant="success">{successMessage}</Alert>
            )}
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}
