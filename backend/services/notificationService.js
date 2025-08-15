const EventEmitter = require('events');
const nodemailer = require('nodemailer');

class NotificationService extends EventEmitter {
  async sendWebSocket(notification) {
    this.emit('notification', notification);
  }

  async sendEmail(to, notification) {
    try {
      if (!process.env.SMTP_HOST) {
        console.log(`Email to ${to}: ${notification.message}`);
        return;
      }
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'no-reply@example.com',
        to,
        subject: 'FalconTrade Notification',
        text: notification.message,
      });
    } catch (err) {
      console.error('Failed to send email', err);
    }
  }

  async broadcast(notification, users) {
    await this.sendWebSocket(notification);
    if (Array.isArray(users)) {
      for (const user of users) {
        if (user.email) {
          await this.sendEmail(user.email, notification);
        }
      }
    }
  }
}

module.exports = new NotificationService();
