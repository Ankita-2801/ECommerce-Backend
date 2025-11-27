// utils/emailService.js (Complete & Corrected Code)
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
// We no longer need to import connectUserDB here, as it's done inside getUserModel
import { getUserModel } from '../models/User.js'; 

dotenv.config();

// --- Nodemailer Transporter Setup ---
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, 
    port: process.env.SMTP_PORT, 
    secure: false, 
    requireTLS: true, 
    auth: {
        user: process.env.MAIL_USER, 
        pass: process.env.MAIL_PASS, // IMPORTANT: Must be a Gmail App Password
    },
});

/**
 * Sends a single email with HTML formatting.
 */
const sendSingleEmail = async (to, subject, body) => {
    try {
        const mailOptions = {
            from: `"GreenRemedy Offers" <${process.env.MAIL_USER}>`,
            to: to,
            subject: subject,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9; color: #333;">
                    <h2 style="color: #4CAF50;">${subject}</h2>
                    <p style="line-height: 1.6;">${body.replace(/\n/g, '<br>')}</p>
                    <p style="margin-top: 25px;">
                        <a href="YOUR_STORE_LINK" style="display: inline-block; padding: 12px 25px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                            Shop Now & Save!
                        </a>
                    </p>
                    <p style="margin-top: 30px; font-size: 12px; color: #999;">This offer was sent to ${to}.</p>
                </div>
            `, 
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s to %s', info.messageId, to);
        return true;
    } catch (error) {
        console.error('Error sending email to %s:', to, error.message);
        return false;
    }
};

/**
 * Fetches all non-admin customer emails from the database.
 * This is now correctly handling the asynchronous nature of getUserModel().
 */
const getCustomerEmails = async () => {
    try {
        // AWAIT the asynchronous function to get the connected Mongoose Model
        const UserModel = await getUserModel(); 
        
        // Query the UserModel for users with role 'user'
        const users = await UserModel.find({ role: 'user' }).select('email');
        return users.map(user => user.email);

    } catch (error) {
        console.error("Database Error: Could not fetch customer emails:", error.message);
        return [];
    }
};



export const sendBulkEmail = async (subject, body) => {
    const customerEmails = await getCustomerEmails();
    
    if (customerEmails.length === 0) {
        return { message: 'No non-admin customer emails found to send to.', totalRecipients: 0 };
    }

    console.log(`Attempting to send offer to ${customerEmails.length} customers.`);

    const sendPromises = customerEmails.map(email => sendSingleEmail(email, subject, body));
    const results = await Promise.allSettled(sendPromises);

    const successfulSends = results.filter(r => r.status === 'fulfilled' && r.value === true).length;
    const failedSends = results.length - successfulSends;

    return {
        totalRecipients: customerEmails.length,
        successfulSends,
        failedSends,
    };
};