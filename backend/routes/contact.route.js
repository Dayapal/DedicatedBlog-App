import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: "dayapal235370@gmail.com",
      to: process.env.EMAIL_USER,
      subject: `New message from ${name}`,
      text: `Email ${email}\n\nMessage : ${message}`,
    };
    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .json({ success: true, message: "Message send successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to send message." });
  }
});

export default router;