'use client';

import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
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
  const [isExporting, setIsExporting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
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

  const downloadCsv = (csvString: string, filename: string) => {
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const onSubmit = async () => {
    await handleExport();
  };

  const handleExport = async () => {
    setIsExporting(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      if (dateMode === 'range') {
        const { startDate, endDate } = getValues();
        const result = await exportDonationsInRange({
          startDate: startDate || '',
          endDate: endDate || '',
        });

        if (!result?.success || !result.data) {
          setErrorMessage('Failed to export donations.');
          return;
        }

        downloadCsv(result.data, `donations_${startDate}_to_${endDate}.csv`);
      } else {
        const result = await exportDonations();

        if (!result?.success || !result.data) {
          setErrorMessage('Failed to export donations.');
          return;
        }

        downloadCsv(result.data, 'donations.csv');
      }

      setSuccessMessage('Donations export downloaded.');
    } catch (error) {
      setErrorMessage('Donations export error: ' + error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        <input type="radio" value="all" {...register('dateMode')} />
        All time
      </label>
      <br />
      <label>
        <input type="radio" value="range" {...register('dateMode')} />
        Date range
      </label>
      <br />
      {dateMode === 'range' && (
        <div>
          <label>Start date</label>
          <input
            type="date"
            {...register('startDate', { required: 'Start date is required.' })}
          />
          {errors.startDate && (
            <p style={{ color: 'red' }}>{errors.startDate.message}</p>
          )}
          <br />
          <label>End date</label>
          <input
            type="date"
            {...register('endDate', { required: 'End date is required.' })}
          />
          {errors.endDate && (
            <p style={{ color: 'red' }}>{errors.endDate.message}</p>
          )}
        </div>
      )}

      {errorMessage && <p role="alert">{errorMessage}</p>}
      {successMessage && <p role="status">{successMessage}</p>}
      <button type="submit" disabled={isExporting}>
        {isExporting ? 'Exporting...' : 'Export'}
      </button>
    </form>
  );
}
