import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import bcrypt from 'bcrypt';
import logger from '../server/utils/logger.js';

const saltRounds = 10;
let pool;

(async () => {
  try {
    const db = JSON.parse(await fs.readFile('./../db/eventHallsData.json', 'utf-8'));

    pool = mysql.createPool({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      multipleStatements: true,
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
        image VARCHAR(255),
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
        guests INT NOT NULL DEFAULT 0,
        status ENUM('confirmed', 'canceled') DEFAULT 'confirmed',
        payment DECIMAL(10, 2) DEFAULT 0.00,
        cancellation_fee DECIMAL(10, 2) DEFAULT 0.00,
        paypal_capture_id VARCHAR(255),
        total_catering_price DECIMAL(10, 2) DEFAULT 0.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (hall_id) REFERENCES halls(id) ON DELETE CASCADE
      );

      CREATE TABLE booking_catering_options (
        booking_id INT NOT NULL,
        catering_option_id INT NOT NULL,
        PRIMARY KEY (booking_id, catering_option_id),
        FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
        FOREIGN KEY (catering_option_id) REFERENCES catering_options(id) ON DELETE CASCADE
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
        `INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)`,
        [user.id, user.name, user.email, hashedPassword, user.role]
      );
    }

    // Insert halls
    for (const hall of db.halls) {
      await pool.query(
        `INSERT INTO halls (id, name, location, price, capacity, description, about, category, owner_id, approved)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
          hall.approved,
        ]
      );
    }

    // Insert catering options
    for (const catering of db.catering_options) {
      await pool.query(
        `INSERT INTO catering_options (id, hall_id, course_type, option_name, price, description)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          catering.id,
          catering.hall_id,
          catering.course_type,
          catering.option_name,
          catering.price,
          catering.description,
        ]
      );
    }

    // Insert bookings
    for (const booking of db.bookings) {
      await pool.query(
        `INSERT INTO bookings (
           id, user_id, hall_id, event_date, status, payment,
           cancellation_fee, guests, paypal_capture_id, total_catering_price
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          booking.id,
          booking.user_id,
          booking.hall_id,
          booking.event_date,
          booking.status,
          booking.payment,
          booking.cancellation_fee,
          booking.guests,
          booking.paypal_capture_id || null,
          booking.total_catering_price,
        ]
      );

      // Insert catering choices (many-to-many)
      if (Array.isArray(booking.catering_ids)) {
        for (const optionId of booking.catering_ids) {
          await pool.query(
            `INSERT INTO booking_catering_options (booking_id, catering_option_id) VALUES (?, ?)`,
            [booking.id, optionId]
          );
        }
      }
    }

    // Insert reviews
    for (const review of db.reviews) {
      await pool.query(
        `INSERT INTO reviews (id, user_id, hall_id, rating, comment, discount_given)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          review.id,
          review.user_id,
          review.hall_id,
          review.rating,
          review.comment,
          review.discount_given,
        ]
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
