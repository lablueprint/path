'use client';

import { useForm } from 'react-hook-form';
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
    watch,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      dateMode: 'all',
    },
  });

  const dateMode = watch('dateMode');

  const onSubmit = (data: FormValues) => {
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

      <button type="submit">Export</button>
    </form>
  );
}
