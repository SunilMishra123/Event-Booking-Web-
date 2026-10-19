const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // tumhara pumfycmooxqcbbrh wala
    }
});

const sendOTPEmail = async (userEmail, otp, type) => {
    try {
        const title = type === 'account_verification' ? 'Verify your Eventora Account' : 'Eventora Booking Verification';
        const mailOptions = {
            from: `"Eventora" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: title,
            html: `
                <div style="font-family: Arial; text-align: center; padding: 20px;">
                    <h2>${title}</h2>
                    <p>Your OTP is:</p>
                    <div style="font-size: 24px; font-weight: bold; background: #f4f4f4; padding: 15px; letter-spacing: 5px;">${otp}</div>
                    <p>This expires in 5 minutes.</p>
                </div>
            `
        };
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ OTP ${otp} sent to ${userEmail}`, info.messageId);
    } catch (error) {
        console.error('❌ EMAIL ERROR:', error.message);
        // Error ko throw mat karo, warna register fail ho jayega
    }
};

const sendBookingEmail = async (userEmail, userName, eventTitle) => {
    // tumhara booking wala code same rehne do
};

module.exports = { sendBookingEmail, sendOTPEmail };