import express from "express";
import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY);
console.log("RESEND KEY =", process.env.RESEND_API_KEY);

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
    font-family: 'Segoe UI', Tahoma, sans-serif;
    background-color: #f4f6f8;
    padding: 40px 0;
    width: 100%;
  ">
    <div style="
      max-width: 600px;
      margin: auto;
      background: #ffffff;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 4px 25px rgba(0,0,0,0.08);
      border: 1px solid #e8e8e8;
    ">
      
      <!-- HEADER -->
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="
          font-size: 26px;
          font-weight: 700;
          color: #111827;
          margin: 0;
        ">
          📩 New Message Received
        </h1>
        <p style="color: #6b7280; margin-top: 8px; font-size: 15px;">
          Someone contacted you through your website
        </p>
      </div>

      <!-- DETAILS CARD -->
      <div style="
        background: #f9fafb;
        padding: 20px;
        border-radius: 10px;
        border: 1px solid #e5e7eb;
        margin-bottom: 25px;
      ">
        <p style="margin: 0 0 12px;">
          <strong style="color: #111827;">👤 Name:</strong>
          <span style="color: #374151;">${name}</span>
        </p>

        <p style="margin: 0 0 12px;">
          <strong style="color: #111827;">📧 Email:</strong>
          <span style="color: #374151;">${email}</span>
        </p>

        <p style="margin: 0;">
          <strong style="color: #111827;">💬 Message:</strong>
        </p>
        <div style="
          margin-top: 8px;
          padding: 15px;
          background: #ffffff;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          color: #374151;
          white-space: pre-wrap;
          font-size: 15px;
          line-height: 1.6;
        ">
          ${message}
        </div>
      </div>

      <!-- FOOTER -->
      <div style="text-align: center; margin-top: 30px;">
        <p style="
          font-size: 13px;
          color: #9ca3af;
          line-height: 1.5;
        ">
          This email was sent automatically from your website’s contact form.<br />
          © ${new Date().getFullYear()} Your Website — All rights reserved.
        </p>
      </div>

    </div>
  </div>`,
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
