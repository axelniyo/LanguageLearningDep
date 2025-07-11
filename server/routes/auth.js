const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const db = require('../config/database');
const router = express.Router();

// JWT secret - in production, this should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

// Create ethereal email transporter for development
let emailTransporter = null;

const createEmailTransporter = async () => {
  if (!emailTransporter) {
    try {
      emailTransporter = nodemailer.createTransport({
        service: 'Gmail', // or use host, port for other providers
        auth: {
          user: process.env.EMAIL_USERNAME, // your Gmail/SMTP username
          pass: process.env.EMAIL_PASSWORD  // your Gmail App Password or SMTP password
        }
      });

      console.log('✅ Real email transporter created');
    } catch (error) {
      console.error('Error creating real email transporter:', error);
      throw error;
    }
  }
  return emailTransporter;
};


// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      username: user.username 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Sign up route
router.post('/signup', async (req, res) => {
  console.log('Signup attempt:', req.body);
  
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ 
        message: 'Email, password, and username are required' 
      });
    }

    // Check if user already exists
    const existingUser = await new Promise((resolve, reject) => {
      db.query(
        'SELECT id FROM users WHERE email = ? OR username = ?',
        [email, username],
        (err, results) => {
          if (err) reject(err);
          else resolve(results[0]);
        }
      );
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email or username already exists' 
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const userId = await new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO users (email, username, password_hash, xp, level, streak_count) VALUES (?, ?, ?, 0, 1, 0)',
        [email, username, hashedPassword],
        (err, result) => {
          if (err) reject(err);
          else resolve(result.insertId);
        }
      );
    });

    // Get the created user
    const newUser = await new Promise((resolve, reject) => {
      db.query(
        'SELECT id, email, username, xp, level, streak_count, created_at FROM users WHERE id = ?',
        [userId],
        (err, results) => {
          if (err) reject(err);
          else resolve(results[0]);
        }
      );
    });

    // Generate token
    const token = generateToken(newUser);

    res.status(201).json({
      user: newUser,
      token: token
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      message: 'Internal server error during signup' 
    });
  }
});

// Sign in route
router.post('/signin', async (req, res) => {
  console.log('Signin attempt:', req.body);
  
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required' 
      });
    }

    // Find user
    const user = await new Promise((resolve, reject) => {
      db.query(
        'SELECT id, email, username, password_hash, xp, level, streak_count, created_at FROM users WHERE email = ?',
        [email],
        (err, results) => {
          if (err) reject(err);
          else resolve(results[0]);
        }
      );
    });

    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }

    // Remove password from user object
    const { password_hash, ...userWithoutPassword } = user;

    // Generate token
    const token = generateToken(userWithoutPassword);

    res.json({
      user: userWithoutPassword,
      token: token
    });

  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ 
      message: 'Internal server error during signin' 
    });
  }
});

// Forgot password route
router.post('/forgot-password', async (req, res) => {
  console.log('=== FORGOT PASSWORD REQUEST ===');
  console.log('Request body:', req.body);
  console.log('Request headers:', req.headers);
  
  try {
    const { email } = req.body;

    if (!email) {
      console.log('❌ No email provided');
      return res.status(400).json({ 
        message: 'Email is required' 
      });
    }

    console.log('✅ Looking for user with email:', email);

    // Check if user exists
    const user = await new Promise((resolve, reject) => {
      console.log('📊 Executing database query...');
      db.query(
        'SELECT id, email, username FROM users WHERE email = ?',
        [email],
        (err, results) => {
          if (err) {
            console.error('❌ Database query error:', err);
            console.error('❌ Error details:', {
              code: err.code,
              errno: err.errno,
              sqlMessage: err.sqlMessage,
              sqlState: err.sqlState
            });
            reject(err);
          } else {
            console.log('✅ Database query successful');
            console.log('📊 Query results:', results);
            console.log('📊 Results length:', results.length);
            resolve(results[0]);
          }
        }
      );
    });

    if (!user) {
      console.log('⚠️ User not found for email:', email);
      // For security, don't reveal if email exists or not
      return res.json({ 
        message: 'If an account with that email exists, a password reset link has been sent.' 
      });
    }

    console.log('✅ User found:', { id: user.id, email: user.email, username: user.username });

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    console.log('🔑 Generated reset token:', resetToken.substring(0, 10) + '...');
    console.log('⏰ Token expiry:', resetTokenExpiry);

    // Store reset token in database
    console.log('💾 Storing reset token in database...');
    await new Promise((resolve, reject) => {
      db.query(
        'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?',
        [resetToken, resetTokenExpiry, user.id],
        (err, result) => {
          if (err) {
            console.error('❌ Database update error:', err);
            console.error('❌ Update error details:', {
              code: err.code,
              errno: err.errno,
              sqlMessage: err.sqlMessage,
              sqlState: err.sqlState
            });
            reject(err);
          } else {
            console.log('✅ Database update successful');
            console.log('📊 Update result:', result);
            resolve(result);
          }
        }
      );
    });

       // Create reset URL with the correct frontend URL
    const resetUrl = `https://languagelearningdep-2.onrender.com/reset-password?token=${resetToken}`;
    console.log('🔗 Reset URL created:', resetUrl);

    // Send email
    console.log('📧 Creating email transporter...');
    try {
      const transporter = await createEmailTransporter();
      console.log('✅ Email transporter ready');
      
      const mailOptions = {
        from: '"Language Learning App" <noreply@languageapp.com>',
        to: user.email,
        subject: 'Password Reset Request',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #22c55e;">Password Reset Request</h2>
            <p>Hello ${user.username},</p>
            <p>You requested a password reset for your Language Learning App account.</p>
            <p>Click the button below to reset your password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">Reset Password</a>
            </div>
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; color: #3b82f6;">${resetUrl}</p>
            <p><strong>This link will expire in 1 hour.</strong></p>
            <p>If you didn't request this password reset, please ignore this email.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px;">Language Learning App</p>
          </div>
        `
      };

      console.log('📧 Mail options prepared:', {
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject
      });

      console.log('📧 Sending email...');
      const info = await transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully!');
      console.log('📧 Email info:', info);
      
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log('📧 Preview URL:', previewUrl);
      console.log('🔗 Reset URL for testing:', resetUrl);
      
      res.json({ 
        message: 'If an account with that email exists, a password reset link has been sent.',
        previewUrl: previewUrl // Only for development
      });

    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError);
      console.error('❌ Email error details:', {
        message: emailError.message,
        code: emailError.code,
        command: emailError.command,
        response: emailError.response
      });
      
      // Still return success to user for security, but log the error
      res.json({ 
        message: 'If an account with that email exists, a password reset link has been sent.',
        error: 'Email sending failed - check server logs'
      });
    }

  } catch (error) {
    console.error('❌ FORGOT PASSWORD ERROR:', error);
    console.error('❌ Error stack:', error.stack);
    console.error('❌ Error details:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlMessage: error.sqlMessage,
      sqlState: error.sqlState
    });
    
    res.status(500).json({ 
      message: 'Internal server error during password reset request',
      error: error.message
    });
  }
});

// Reset password route
router.post('/reset-password', async (req, res) => {
  console.log('Reset password attempt:', req.body);
  
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ 
        message: 'Token and new password are required' 
      });
    }

    // Find user with valid reset token
    const user = await new Promise((resolve, reject) => {
      db.query(
        'SELECT id, email, username, reset_token_expiry FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()',
        [token],
        (err, results) => {
          if (err) reject(err);
          else resolve(results[0]);
        }
      );
    });

    if (!user) {
      return res.status(400).json({ 
        message: 'Invalid or expired reset token' 
      });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password and clear reset token
    await new Promise((resolve, reject) => {
      db.query(
        'UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?',
        [hashedPassword, user.id],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });

    console.log(`Password reset successful for user: ${user.email}`);
    
    res.json({ 
      message: 'Password has been reset successfully. You can now sign in with your new password.' 
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ 
      message: 'Internal server error during password reset' 
    });
  }
});

// Sign out route
router.post('/signout', (req, res) => {
  // For JWT, we can't invalidate tokens on the server side easily
  // The client will remove the token from localStorage
  res.json({ message: 'Signed out successfully' });
});

module.exports = router;
