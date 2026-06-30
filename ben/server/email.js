'use strict';
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM || 'Spider Hub <onboarding@resend.dev>';
const PUBLIC_URL = (process.env.PUBLIC_URL || 'http://localhost:3000').replace(/\/$/, '');

async function sendMail({ to, subject, html, text }) {
  try {
    const { error } = await resend.emails.send({ from: FROM, to, subject, html, text });
    if (error) {
      console.error('[email] send failed:', error.message || error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[email] send failed:', err.message);
    return false;
  }
}

function sendVerificationEmail(to, name, token) {
  const link = `${PUBLIC_URL}/verify.html?token=${token}`;
  return sendMail({
    to,
    subject: 'Verify your Spider Hub account',
    text: `Hi ${name}, verify your account: ${link} (expires in 24 hours)`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto">
        <h2 style="color:#7b2ff7">Welcome to Spider Hub, ${escapeHtml(name)}!</h2>
        <p>Please confirm your email address to activate your account.</p>
        <p style="margin:24px 0">
          <a href="${link}" style="background:#7b2ff7;color:#fff;padding:12px 24px;
             border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block">
            Verify My Email
          </a>
        </p>
        <p style="color:#888;font-size:13px">This link expires in 24 hours. If the button doesn't work, copy this link:<br>${link}</p>
        <p style="color:#888;font-size:13px">If you didn't sign up for Spider Hub, you can ignore this email.</p>
      </div>`
  });
}

function sendResetEmail(to, name, token) {
  const link = `${PUBLIC_URL}/reset.html?token=${token}`;
  return sendMail({
    to,
    subject: 'Reset your Spider Hub password',
    text: `Hi ${name}, reset your password: ${link} (expires in 1 hour)`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto">
        <h2 style="color:#7b2ff7">Password reset request</h2>
        <p>Hi ${escapeHtml(name)}, click below to set a new password.</p>
        <p style="margin:24px 0">
          <a href="${link}" style="background:#7b2ff7;color:#fff;padding:12px 24px;
             border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block">
            Reset Password
          </a>
        </p>
        <p style="color:#888;font-size:13px">This link expires in 1 hour. If the button doesn't work, copy this link:<br>${link}</p>
        <p style="color:#888;font-size:13px">If you didn't request this, you can safely ignore this email.</p>
      </div>`
  });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

module.exports = { sendVerificationEmail, sendResetEmail };
