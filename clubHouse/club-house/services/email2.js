const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
require("dotenv").config();
const email = {};

const transporter = nodemailer.createTransport(
  smtpTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
);
email.sendResetPasswordEmail = (email, token) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset",
    text: `You requested a password reset. Click the link to reset your password: http://schemas.android.com/apk/res/android/${token}`,
  };
  console.log("✌️mailOptions --->", mailOptions);
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};
email.sendSetPasswordEmail = (email, token) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Set Your Admin Password",
    text: `You requested to set your password. Click the link to set your password: http://yourdomain.com/set-password/${token}`,
  };
  console.log("✌️mailOptions --->", mailOptions);
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};
email.sendInvitationEmail = (email, token, clubName, role) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `You're Invited: Join ${clubName} as a ${role}`,
    html: `
      <html>
        <body>
          <p>Hello,</p>
          <p>We're excited to invite you to join ${clubName} as a ${role}. To get started, please click the button below to accept your invitation and set up your account:</p>
          <p>
            <a href="http://99.79.127.251:3000/reset_password/${token}" style="
               display: inline-block;
              padding: 8px 16px;
              font-size: 14px;
              font-weight: bold;
              color: #ffffff;
              background-color: #007bff;
              text-decoration: none;
              border-radius: 4px;
            ">Accept Invitation</a>
          </p>
          <p>Please note that this link is valid for 24 hours. If you encounter any issues or have questions, feel free to reach out to our support team.</p>
          <p>Best regards,<br>${clubName} Team</p>
        </body>
      </html>
    `,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};





module.exports = email;
