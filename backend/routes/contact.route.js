import express from "express";
import { Resend } from "resend";

const router = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY);

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  // 🛑 Validate inputs
  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    // ✉️ Send email with HTML formatting
    const { data, error } = await resend.emails.send({
      from: "Your Website <onboarding@resend.dev>", // ✅ Use default verified sender
      to: "dayapal235370@gmail.com", // ✅ Your inbox to receive messages
      subject: `📬 New Message from ${name}`,
      html: `
        <div style="
          font-family: Arial, sans-serif;
          background-color: #f9f9f9;
          padding: 20px;
          border-radius: 10px;
          border: 1px solid #e0e0e0;
        ">
          <h2 style="color: #2c3e50;">New Contact Form Message</h2>
          <p style="font-size: 16px; color: #333;">
            You’ve received a new message from your website contact form.
          </p>

          <div style="
            background-color: #fff;
            padding: 15px;
            border-radius: 8px;
            margin-top: 10px;
          ">
            <p><strong style="color: #2c3e50;">Name:</strong> ${name}</p>
            <p><strong style="color: #2c3e50;">Email:</strong> ${email}</p>
            <p><strong style="color: #2c3e50;">Message:</strong></p>
            <p style="white-space: pre-wrap; color: #555;">${message}</p>
          </div>

          <p style="margin-top: 20px; font-size: 14px; color: #999;">
            📩 Sent automatically from your website contact form.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return res.status(500).json({ success: false, message: "Failed to send email" });
    }

    res.status(200).json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
});

export default router;
