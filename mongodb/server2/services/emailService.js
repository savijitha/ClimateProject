// C:\Users\Disha\Climate-Smart-Agriculture-Platform\mongodb\server\services\emailService.js
const nodemailer = require('nodemailer');

// It's crucial to use environment variables for security.
// Ensure you have a .env file with EMAIL_USER and EMAIL_PASS.
const transporter = nodemailer.createTransport({
  service: 'Gmail', // You can use other services like SendGrid, etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use an App Password for Gmail
  },
});

exports.sendRequestEmail = (requesterEmail, recipientEmail, seedName) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipientEmail,
    subject: `New Request for Your Seed: ${seedName}`,
    html: `
      <p>Hello,</p>
      <p>A new request has been made for your seed listing: <b>${seedName}</b>.</p>
      <p>The requester's email is: <b>${requesterEmail}</b>.</p>
      <p>Please log in to your dashboard to manage this request and connect with the requester.</p>
      <br/>
      <p>Thank you,<br/>The Climate-Smart-Agriculture-Platform Team</p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};