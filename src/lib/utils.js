import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}



export  function formatRupiah (number) {
  if (number == null || isNaN(number)) return "";
  return `Rp.${Number(number).toLocaleString("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};


export function formatJakartaTime  (dateInput) {
  const date = new Date(dateInput);
  const options = { timeZone: 'Asia/Jakarta', hour12: false };

  const jakartaTime = new Intl.DateTimeFormat('en-GB', {
    ...options,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    // second: '2-digit'
  }).format(date);

  // Format ke "YYYY-MM-DD HH:mm:ss"
  const [datePart, timePart] = jakartaTime.split(', ');
  const [day, month, year] = datePart.split('/');
  const formattedDate = `${year}-${month}-${day} ${timePart}`;

  return formattedDate;
};


