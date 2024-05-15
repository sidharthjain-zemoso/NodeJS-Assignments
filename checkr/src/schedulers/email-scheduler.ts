import nodemailer from 'nodemailer';
import { EmailConfig } from '../common/interfaces/pre-adverse-email-config';
import { PreAdverseEmail } from '../models/pre-adverse-email';

// Function to send email
export const sendEmail = async (emailConfig: EmailConfig): Promise<void> => {
    console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS);
    const transporter = nodemailer.createTransport({
        /* Configure your email transport options (e.g., SMTP, Gmail, etc.) */
        service: 'gmail',
        
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions: nodemailer.SendMailOptions = {
        from: emailConfig.fromEmail,
        to: emailConfig.toEmail,
        subject: emailConfig.subject,
        text: emailConfig.body
    };

    try {
        // Send email
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', emailConfig);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

// Function to process pending emails
export const processPendingEmails = async (candidateId: number): Promise<void> => {
    // Query pending email configurations from the database
    const pendingEmails = await PreAdverseEmail.findAll({ where: { candidateId } });
    console.log("Pending emails:", pendingEmails, " candidateId:", candidateId);
    
    for (const emailConfig of pendingEmails) {
        // Send email
        await sendEmail(emailConfig.toJSON());
        // Update email count
        emailConfig.count -= 1;
        if (emailConfig.count === 0) {
            // Delete email configuration if count reaches zero
            await emailConfig.destroy();
        } else {
            // Save updated email configuration
            await emailConfig.save();
        }
    }
}
