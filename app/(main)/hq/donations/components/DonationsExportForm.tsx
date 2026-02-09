'use client';

import { useForm } from 'react-hook-form';
import {
  exportDonations,
  exportDonationsInRange,
} from '../../../../actions/donation';

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
    console.log(data);
  };

  const handleExport = async () => {
    if (dateMode === 'range') {
      const { startDate, endDate } = getValues();
      const csvString = await exportDonationsInRange({ startDate, endDate });
      const blob = new Blob([csvString], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('href', url);
      a.setAttribute('download', `donations_${startDate}_to_${endDate}.csv`);
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      const csvString = await exportDonations();
      const blob = new Blob([csvString], { type: 'text/csv' });
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
      <fieldset>
        <legend>Date Filter</legend>

        <label>
          <input type="radio" value="all" {...register('dateMode')} />
          All Dates
        </label>

        <br />

        <label>
          <input type="radio" value="range" {...register('dateMode')} />
          Date Range
        </label>
      </fieldset>

      {dateMode === 'range' && (
        <div>
          <label>Start Date</label>
          <input
            type="date"
            {...register('startDate', { required: 'Start date is required' })}
          />
          {errors.startDate && (
            <p style={{ color: 'red' }}>{errors.startDate.message}</p>
          )}
          <label>End Date</label>
          <input
            type="date"
            {...register('endDate', { required: 'End date is required' })}
          />
          {errors.endDate && (
            <p style={{ color: 'red' }}>{errors.endDate.message}</p>
          )}
        </div>
      )}

      <button onClick={handleExport}> Export</button>
    </form>
  );
}
