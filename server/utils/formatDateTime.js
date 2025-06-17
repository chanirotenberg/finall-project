import dayjs from 'dayjs';
import 'dayjs/locale/he.js';

dayjs.locale('he');

export function formatDateTime(date) {
  return dayjs(date).format('D [ב]MMMM YYYY'); 
  // דוגמה לפלט: 16 ביוני 2025
}
