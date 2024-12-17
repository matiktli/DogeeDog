import formData from 'form-data';
import Mailgun from 'mailgun.js';
import { readFileSync } from 'fs';
import path from 'path';
import { sign } from 'jsonwebtoken';

const mailgun = new Mailgun(formData);

const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY || '',
  url: 'https://api.eu.mailgun.net',
});

const domain = process.env.MAILGUN_DOMAIN || '';

export interface EmailData {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail({ to, subject, text, html }: EmailData) {
  try {
    const messageData = {
      from: `DogeeDog <mailgun@${domain}>`,
      to: [to],
      subject,
      text,
      html,
      message: '',
    };
    
    const result = await mg.messages.create(domain, messageData);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

function loadEmailTemplate(templateName: string): string {
  const templatePath = path.join(process.cwd(), 'app', 'resources', 'emailTemplates', `${templateName}.html`);
  return readFileSync(templatePath, 'utf-8');
}

function generateMagicLink(email: string): string {
  const token = sign(
    { email, exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) }, // 24 hour expiry
    process.env.NEXTAUTH_SECRET || ''
  );
  
  return `${process.env.NEXTAUTH_URL}/api/auth/magic-login?token=${token}`;
}

export async function sendWelcomeEmail(email: string, name: string) {
  const subject = 'Welcome to Our App!';
  const template = loadEmailTemplate('welcome');
  const magicLink = generateMagicLink(email);
  
  const html = template
    .replace('{{name}}', name)
    .replace('{{magicLink}}', magicLink)
    .replace('{{baseUrl}}', process.env.NEXTAUTH_URL || '');
    
  console.log("Sending welcome email to: ", email)
  return sendEmail({
    to: email,
    subject,
    html,
  });
} 