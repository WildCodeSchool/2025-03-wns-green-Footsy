export function toISODateString(
  date: Date | string | null | undefined
): string {
  if (!date) {
    return "";
  }

  try {
    if (date instanceof Date) {
      return date.toISOString().split("T")[0];
    }

    const dateObj = new Date(date);

    if (Number.isNaN(dateObj.getTime())) {
      console.error("Invalid date:", date);
      return "";
    }

    return dateObj.toISOString().split("T")[0];
  } catch (error) {
    console.error("Error converting date to ISO string:", error, date);
    return "";
  }
}

export function formatDateForDisplay(
  date: Date | string | null | undefined,
  locale: string = navigator.language,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }
): string {
  if (!date) {
    return "";
  }

  try {
    const dateObj = date instanceof Date ? date : new Date(date);

    if (Number.isNaN(dateObj.getTime())) {
      console.error("Invalid date:", date);
      return "";
    }

    return new Intl.DateTimeFormat(locale, options).format(dateObj);
  } catch (error) {
    console.error("Error formatting date:", error, date);
    return "";
  }
}
