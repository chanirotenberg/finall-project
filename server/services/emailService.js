import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' }); // או איפה שהקובץ יושב בפועל

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
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

// לשלוח מייל לשחזור סיסמה
export const sendForgotPasswordEmail = async (to, resetLink) => {
  await sendEmail({
    to,
    subject: 'שחזור סיסמה - מערכת אולמות',
    html: `<p>לחץ על הקישור לשחזור סיסמה:</p><a href="${resetLink}">${resetLink}</a>`
  });
};

// לשלוח מייל אישור הזמנה
export const sendBookingConfirmation = async (to, htmlContent) => {
  await sendEmail({
    to,
    subject: 'אישור הזמנת אולם',
    html: htmlContent
  });
};

// לשלוח מייל לביקורת
export const sendReviewRequest = async (to, hallName, reviewLink) => {
  await sendEmail({
    to,
    subject: 'ספר לנו איך היה האירוע!',
    html: `<p>איך היה באולם <strong>${hallName}</strong>?<br/>נשמח לקבל ממך תגובה:</p>
           <a href="${reviewLink}">לחץ כאן לכתיבת ביקורת</a>`
  });
};

// להודיע לבעל אולם שהוזמן אולם שלו
export const sendOwnerNotification = async (to, userName, eventDate, hallName) => {
  await sendEmail({
    to,
    subject: 'התקבלה הזמנה חדשה לאולם שלך!',
    html: `<p>שלום,</p>
           <p>המשתמש <strong>${userName}</strong> הזמין את האולם <strong>${hallName}</strong> לתאריך: ${eventDate}</p>`
  });
};
