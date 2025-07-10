import * as React from 'react';
import { DayPicker, DayPickerSingleProps } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { cn } from '@/lib/utils';

interface CalendarProps extends DayPickerSingleProps {
  className?: string;
  disabled?: (date: Date) => boolean;
}

export function Calendar({ className, ...props }: CalendarProps) {
  return (
    <DayPicker
      className={cn('rounded-xl border p-4 shadow-sm bg-white', className)}
      {...props}
    />
  );
}
