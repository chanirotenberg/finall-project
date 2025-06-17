import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { formatDateTime } from '../utils/formatDateTime.js';

dotenv.config({ path: '../.env' }); // עדכן נתיב אם צריך

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

export const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${to}`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}`, error);
  }
};

// מייל לבעל אולם על הזמנה חדשה
export const sendOwnerNotification = async (to, userName, eventDate, hallName) => {
  const formattedDate = formatDateTime(eventDate);

  await sendEmail({
    to,
    subject: 'התקבלה הזמנה חדשה לאולם שלך!',
    html: `<p>שלום,</p>
           <p>המשתמש <strong>${userName}</strong> הזמין את האולם <strong>${hallName}</strong> לתאריך: <strong>${formattedDate}</strong></p>`
  });
};



export const sendBookingConfirmation = async (to, booking) => {
  const formattedDate = formatDateTime(booking.event_date);

  await sendEmail({
    to,
    subject: 'אישור הזמנת אולם',
    html: `  <h2>אישור הזמנה</h2>
    <p>שלום ${booking.user_name},</p>
    <p>האולם <strong>${booking.hall_name}</strong> הוזמן בהצלחה לתאריך <strong>${formattedDate}</strong>.</p>
    <p>נשמח לראותך!</p>`
  });
};


// מייל תגובה ללקוח לאחר אירוע
export const sendReviewRequest = async (to, hallName, reviewLink) => {
  await sendEmail({
    to,
    subject: 'ספר לנו איך היה האירוע!',
    html: `<p>איך היה באולם <strong>${hallName}</strong>?<br/>נשמח לקבל ממך תגובה:</p>
           <a href="${reviewLink}">לחץ כאן לכתיבת ביקורת</a>`
  });
};

// מייל שחזור סיסמה
export const sendForgotPasswordEmail = async (to, resetLink) => {
  await sendEmail({
    to,
    subject: 'שחזור סיסמה - מערכת אולמות',
    html: `<p>לחץ על הקישור לשחזור סיסמה:</p><a href="${resetLink}">${resetLink}</a>`
  });
};
export const sendHallApprovalEmail = async (to, hallName) => {
  await sendEmail({
    to,
    subject: 'האולם שלך אושר',
    html: `<p>שלום,</p>
           <p>האולם <strong>${hallName}</strong> ששלחת לאישור אושר בהצלחה על ידי מנהל המערכת.</p>
           <p>תודה שהצטרפת אלינו!</p>`
  });
};
