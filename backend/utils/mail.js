import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL, 
    pass: process.env.APP_PASSWORD, 
  },
});

export const sendOtpMail = async (to, otp) => {
  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Feasty - Password Recovery OTP</title>
    <style>
      body {
        font-family: 'Segoe UI', Arial, sans-serif;
        background-color: #f6f8fb;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 520px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 10px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.08);
        overflow: hidden;
      }
      .header {
        background: linear-gradient(135deg, #42a5f5, #1e88e5);
        color: white;
        text-align: center;
        padding: 22px;
      }
      .header h1 {
        margin: 0;
        font-size: 22px;
        letter-spacing: 0.5px;
      }
      .content {
        padding: 30px;
        color: #333;
        line-height: 1.6;
      }
      .otp-box {
        background-color: #e3f2fd;
        border: 1px dashed #2196f3;
        padding: 15px;
        text-align: center;
        font-size: 24px;
        font-weight: bold;
        color: #1565c0;
        letter-spacing: 2px;
        border-radius: 8px;
        margin: 20px 0;
      }
      .footer {
        text-align: center;
        padding: 15px;
        font-size: 13px;
        color: #888888;
        background-color: #fafafa;
      }
      .footer a {
        color: #1e88e5;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Password Recovery - Feasty</h1>
      </div>
      <div class="content">
        <p>Hello,</p>
        <p>We received a request to reset your Feasty account password.</p>
        <p>Use the OTP below to verify your identity and proceed with password recovery:</p>

        <div class="otp-box">${otp}</div>

        <p>This OTP is valid for <b>5 minutes</b>. If you did not request this, you can safely ignore this email.</p>

        <p>For your security, <b>do not share this OTP</b> with anyone.</p>
        <p>— The <b>Feasty Security Team</b></p>
      </div>
      <div class="footer">
        <p>Need help? Contact <a href="mailto:support@feasty.com">support@feasty.com</a></p>
        <p>© ${new Date().getFullYear()} Feasty. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
  `;

  await transporter.sendMail({
    from: `"Feasty Support" <${process.env.EMAIL}>`,
    to: to,
    subject: "Feasty - Password Recovery OTP",
    html: htmlContent,
    text: `Hello,\n\nYour OTP for password recovery is ${otp}.\nThis code is valid for 5 minutes.\nIf you didn’t request this, please ignore the email.\n\n- Feasty Security Team`,
  });
};


export const sendDeliveryOtpMail = async (user, otp) => {
  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Feasty - Delivery OTP</title>
    <style>
      body {
        font-family: 'Segoe UI', Arial, sans-serif;
        background-color: #f4f6f8;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 520px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        overflow: hidden;
      }
      .header {
        background: linear-gradient(135deg, #ff7043, #ff3d00);
        color: white;
        text-align: center;
        padding: 20px;
      }
      .header h1 {
        margin: 0;
        font-size: 24px;
      }
      .content {
        padding: 30px;
        color: #333333;
        line-height: 1.6;
      }
      .otp-box {
        background-color: #fef2e0;
        border: 1px dashed #ff8c00;
        padding: 15px;
        text-align: center;
        font-size: 24px;
        font-weight: bold;
        color: #e65100;
        letter-spacing: 2px;
        border-radius: 6px;
        margin: 20px 0;
      }
      .footer {
        text-align: center;
        padding: 15px;
        font-size: 13px;
        color: #888888;
        background-color: #fafafa;
      }
      .footer a {
        color: #ff7043;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Feasty Delivery Confirmation</h1>
      </div>
      <div class="content">
        <p>Hi <b>${user.fullName || "Customer"}</b>,</p>
        <p>Your delivery OTP for confirming your order is:</p>
        <div class="otp-box">${otp}</div>
        <p>This OTP is valid for <b>5 minutes</b>.</p>
        <p>Please share this code only with your delivery executive to complete your order safely.</p>
        <p>Thank you for choosing <b>Feasty</b>! 🍴</p>
      </div>
      <div class="footer">
        <p>Need help? Contact <a href="mailto:support@feasty.com">support@feasty.com</a></p>
        <p>© ${new Date().getFullYear()} Feasty. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
  `;

  await transporter.sendMail({
    from: `"Feasty Support" <${process.env.EMAIL}>`,
    to: user.email,
    subject: "Feasty - Delivery OTP Verification",
    html: htmlContent,
    text: `Hi ${user.name || "Customer"},\n\nYour delivery OTP is ${otp}. It is valid for 5 minutes.\nPlease share it only with your delivery executive.\n\n- Feasty Team`,
  });
};
