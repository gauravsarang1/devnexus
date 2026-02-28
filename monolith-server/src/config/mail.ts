import nodemailer from 'nodemailer';

const mailTransporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST!,
    port: Number(process.env.MAIL_PORT!),
    secure: process.env.MAIL_SECURE! === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.MAIL_USER!,
        pass: process.env.MAIL_PASS!,
    },
});

export default mailTransporter;