import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

class Mail {
  constructor() {
    dotenv.config();
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: false,
      port: 25,
      auth: {
        user: process.env.QUICK_CREDIT_EMAIL,
        pass: process.env.QUICK_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    const email = {
      Status: 200,
      message: 'Email is sent successfully',
    };
    this.transporter.sendMail = ((mailRequest) => {
      return new Promise(((resolve, reject) => {
        this.transporter.sendMail(mailRequest, (error, info) => {
          console.log('Sending email');
          if (error) {
            reject(error);
            console.log(error);
          } else {
            resolve(email);
            console.log(email);
          }
        });
      }));
    });
  }
}
export default new Mail().transporter;
