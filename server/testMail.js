import { sendEmail } from './services/emailService.js';

sendEmail({
  to: 'c0583212923@gmail.com',
  subject: 'בדיקת מערכת שליחת מיילים',
  html: '<h1>שלום!</h1><p>זה מייל בדיקה מהמערכת שלך</p>'
});
