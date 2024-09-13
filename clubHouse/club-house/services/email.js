// services/email.js
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
require("dotenv").config();
const emailTemplateService = require('../services/emailTemplate');
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

email.sendInvitationEmail = async (recipientEmail, token, clubName, role) => {
  try {
    const template = await emailTemplateService.getEmailTemplate('InvitationEmail');

    if (!template) {
      throw new Error('Email template not found');
    }

    let subject = template.subject;
    let body = template.body;

    subject = subject.replace(/{{clubName}}/g, clubName);
    subject = subject.replace(/{{role}}/g, role);
    body = body.replace(/{{clubName}}/g, clubName);
    body = body.replace(/{{role}}/g, role);
    body = body.replace(/{{token}}/g, `http://99.79.127.251:3000/reset_password/${token}`);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: subject,
      html: body,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);

  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = email;
