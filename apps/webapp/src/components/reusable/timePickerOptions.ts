import type { ReactNode } from "react";

type TimePickerOption = {
  description?: ReactNode;
  isDisabled?: boolean;
  label: ReactNode;
  value: string;
};

type CreateTimePickerOptionsParameters = {
  endTime?: string;
  startTime?: string;
  stepMinutes?: number;
};

const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;

const parseTimeToMinutes = (value: string) => {
  const match = timePattern.exec(value);

  if (!match) {
    return null;
  }

  const [, hours = "0", minutes = "0"] = match;

  return Number(hours) * 60 + Number(minutes);
};

const formatMinutesToTime = (totalMinutes: number) => {
  const normalizedMinutes = Math.max(0, Math.min(totalMinutes, 23 * 60 + 59));
  const hours = Math.floor(normalizedMinutes / 60);
  const minutes = normalizedMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

const createTimePickerOptions = ({
  endTime = "22:00",
  startTime = "05:00",
  stepMinutes = 15,
}: CreateTimePickerOptionsParameters = {}) => {
  const startMinutes = parseTimeToMinutes(startTime);
  const endMinutes = parseTimeToMinutes(endTime);

  if (
    startMinutes === null ||
    endMinutes === null ||
    stepMinutes <= 0 ||
    endMinutes < startMinutes
  ) {
    return [];
  }

  return Array.from(
    { length: Math.floor((endMinutes - startMinutes) / stepMinutes) + 1 },
    (_, index): TimePickerOption => {
      const value = formatMinutesToTime(startMinutes + index * stepMinutes);

      return {
        label: value,
        value,
      };
    },
  );
};

const timePickerOptions = createTimePickerOptions();

export {
  createTimePickerOptions,
  formatMinutesToTime,
  parseTimeToMinutes,
  timePickerOptions,
};
export type { CreateTimePickerOptionsParameters, TimePickerOption };
