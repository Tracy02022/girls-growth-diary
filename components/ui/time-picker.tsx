import React from 'react';
import { Input } from './input';

interface TimePickerProps {
  time: string;
  setTime: (value: string) => void;
}

export function TimePicker({ time, setTime }: TimePickerProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const valid = /^\\d{2}:\\d{2}:\\d{2}$/.test(value);
    if (value.length <= 8) {
      setTime(value);
    }
  };

  return (
    <Input
      type="text"
      value={time}
      onChange={handleChange}
      placeholder="hh:mm:ss"
      className="rounded-xl w-40"
    />
  );
}
