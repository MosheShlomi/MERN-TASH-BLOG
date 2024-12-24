import express from "express";
import nodemailer from 'nodemailer';

const router = express.Router();

router.post("/", async (req, res) => {
    const { email, subject, message } = req.body;
    console.log("im in");
    

    // Create a transporter for Nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail', // You can change this to other email providers (e.g., Mailgun, SendGrid)
        auth: {
            user: process.env.EMAIL_USER,  // Use your environment variable for email
            pass: process.env.EMAIL_PASS,  // Use your environment variable for password
        },
    });

    // Set up email options
    const mailOptions = {
        from: email, // Sender's email
        to: process.env.EMAIL_USER, // Recipient's email
        subject: subject,
        text: `הודעה מ: ${email}\n\n${message}`,
    };

    try {
        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
        return res.status(200).json({ success: true, message: 'אימייל נשלח בהצלחה!' });
    } catch (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ success: false, message: 'שליחת מייל נכשלה!' });
    }
});

export default router;