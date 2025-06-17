import express from 'express';
import cors from 'cors';
import logger from './utils/logger.js';

import authRouter from './routes/auth.js';
import hallRouter from './routes/halls.js';
import bookingRouter from './routes/bookings.js';
import reviewRouter from './routes/reviews.js';
import adminRouter from './routes/admin.js';
import userRouter from './routes/users.js'
import cateringRouter from './routes/catering.js';
import paymentRouter from './routes/payment.js';
import ownerRoutes from './routes/owner.js';
import startReviewReminderCron from './services/reviewCron.js';
startReviewReminderCron();

  // הוספת קייטרינג

const app = express();

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173' // עדכן לכתובת של הקליינט שלך
}));

// רוטים ראשיים
app.use('/payment', paymentRouter);
app.use('/auth', authRouter);
app.use('/catering', cateringRouter);
app.use('/halls', hallRouter);
app.use('/bookings', bookingRouter);
app.use('/reviews', reviewRouter);
app.use('/admin', adminRouter);
app.use('/users', userRouter);
app.use('/owner', ownerRoutes); // 👈 חשוב! הוספת ראוטים של owner

// לוכד שגיאות גלובלי
app.use((err, req, res, next) => {
  logger.error("❌ Unhandled error:", err);

  const status = err.status || 500;
  const message = err.message || 'Internal server error';

  res.status(status).json({ error: message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`🚀 Server is running on http://localhost:${PORT}`);
});
