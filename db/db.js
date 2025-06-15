import dotenv from 'dotenv';
dotenv.config({ path: '../.env' }); // או איפה שהקובץ יושב בפועל

import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import bcrypt from 'bcrypt';
import logger from '../server/utils/logger.js'; // עדכן אם צריך

const saltRounds = 10;
let pool;

(async () => {
  try {
    const db = JSON.parse(await fs.readFile('./../db/eventHallsData.json', 'utf-8'));

    pool = mysql.createPool({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      multipleStatements: true
    });

    logger.info('⚠️ Dropping entire database...');
    await pool.query('DROP DATABASE IF EXISTS mydb');
    await pool.query('CREATE DATABASE mydb');
    await pool.query('USE mydb');

    logger.info('🛠️ Creating tables...');
    await pool.query(`
      CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'owner', 'admin') DEFAULT 'user',
        verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
     CREATE TABLE halls (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  location VARCHAR(150) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  capacity INT NOT NULL,
  description TEXT,
  about JSON,
  image VARCHAR(255), -- שדה חדש, לא חובה למלא
  category ENUM('חתונות', 'אירועים קטנים', 'גני אירועים') NOT NULL,
  owner_id INT,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

        CREATE TABLE catering_options (
        id INT AUTO_INCREMENT PRIMARY KEY,
        hall_id INT NOT NULL,
        course_type ENUM('first', 'second', 'third') NOT NULL,
        option_name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (hall_id) REFERENCES halls(id) ON DELETE CASCADE
      );

CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  hall_id INT NOT NULL,
   event_date DATE NOT NULL,
  guests INT NOT NULL DEFAULT 0,  -- ✅ שדה חדש!
  status ENUM( 'confirmed', 'canceled') DEFAULT 'confirmed',
  payment DECIMAL(10, 2) DEFAULT 0.00,
  cancellation_fee DECIMAL(10, 2) DEFAULT 0.00,
  paypal_capture_id VARCHAR(255), -- חדש: מזהה התשלום של PayPal
  first_course_id INT,
  second_course_id INT,
  third_course_id INT,
  total_catering_price DECIMAL(10, 2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (hall_id) REFERENCES halls(id) ON DELETE CASCADE,
  FOREIGN KEY (first_course_id) REFERENCES catering_options(id) ON DELETE SET NULL,
  FOREIGN KEY (second_course_id) REFERENCES catering_options(id) ON DELETE SET NULL,
  FOREIGN KEY (third_course_id) REFERENCES catering_options(id) ON DELETE SET NULL
);


      
    

      CREATE TABLE reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        hall_id INT NOT NULL,
        rating INT CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        discount_given BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (hall_id) REFERENCES halls(id) ON DELETE CASCADE
      );
      
      CREATE TABLE system_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        action TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    logger.info('✅ Inserting data...');

    // Insert users
    for (const user of db.users) {
      const hashedPassword = await bcrypt.hash(user.password, saltRounds);
      await pool.query(
        `INSERT INTO users (id, name, email, password, role, verified) VALUES (?, ?, ?, ?, ?, ?)`,
        [user.id, user.name, user.email, hashedPassword, user.role, user.verified]
      );
    }

    // Insert halls
    for (const hall of db.halls) {
      await pool.query(
        `INSERT INTO halls (id, name, location, price, capacity, description, about, category, owner_id, approved) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          hall.id,
          hall.name,
          hall.location,
          hall.price,
          hall.capacity,
          hall.description,
          JSON.stringify(hall.about || {}),
          hall.category,
          hall.owner_id,
          hall.approved
        ]
      );
    }

    // Insert catering options from the cateringData JSON file
    for (const catering of db.catering_options) {
      await pool.query(
        `INSERT INTO catering_options (hall_id, course_type, option_name, price, description) VALUES (?, ?, ?, ?, ?)`,
        [catering.hall_id, catering.course_type, catering.option_name, catering.price, catering.description]
      );
    }



    // Insert bookings
    for (const booking of db.bookings) {
      await pool.query(
        `INSERT INTO bookings (
    id, user_id, hall_id, event_date, status, payment, cancellation_fee,
    guests,paypal_capture_id,

    first_course_id, second_course_id, third_course_id, total_catering_price
  ) VALUES (?, ?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          booking.id,
          booking.user_id,
          booking.hall_id,
          booking.event_date,
          booking.status,
          booking.payment,
          booking.cancellation_fee,
          booking.guests,
          booking.paypal_capture_id || null, // הכנסה של מזהה PayPal אם קיים
          booking.first_course_id,
          booking.second_course_id,
          booking.third_course_id,
          booking.total_catering_price
        ]
      );

    }
   



    // Insert reviews
    for (const review of db.reviews) {
      await pool.query(
        `INSERT INTO reviews (id, user_id, hall_id, rating, comment, discount_given) VALUES (?, ?, ?, ?, ?, ?)`,
        [review.id, review.user_id, review.hall_id, review.rating, review.comment, review.discount_given]
      );
    }

    logger.info('🎉 All data inserted successfully!');

  } catch (err) {
    logger.error('❌ Setup error: ' + err.message);
  } finally {
    if (pool) {
      await pool.end();
    }
  }
})();
