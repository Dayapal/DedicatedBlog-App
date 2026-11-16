import { Resend } from "resend";
import { env } from "../config/environment.js";
import { ApiError } from "../utils/apiError.js";
import { HTTP_STATUS } from "../constants/statusCodes.js";

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

export class ContactService {
  static async sendContactMessage({ name, email, message }) {
    if (!name || !email || !message) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Name, email, and message are all required."
      );
    }

    if (!resend) {
      console.warn("⚠️ Resend API key is not configured. Email sending skipped in dev mode.");
      return { success: true, simulated: true };
    }

    const { data, error } = await resend.emails.send({
      from: "DedicatedBlog <onboarding@resend.dev>",
      to: env.CONTACT_RECEIVER_EMAIL,
      subject: `📬 New Message from ${name}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, sans-serif; background-color: #f4f6f8; padding: 40px 0; width: 100%;">
          <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 4px 25px rgba(0,0,0,0.08); border: 1px solid #e8e8e8;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="font-size: 26px; font-weight: 700; color: #111827; margin: 0;">📩 New Contact Message</h1>
              <p style="color: #6b7280; margin-top: 8px; font-size: 15px;">DedicatedBlog Platform Inquiry</p>
            </div>
            <div style="background: #f9fafb; padding: 20px; border-radius: 10px; border: 1px solid #e5e7eb; margin-bottom: 25px;">
              <p style="margin: 0 0 12px;"><strong style="color: #111827;">👤 Sender:</strong> <span style="color: #374151;">${name}</span></p>
              <p style="margin: 0 0 12px;"><strong style="color: #111827;">📧 Email:</strong> <span style="color: #374151;">${email}</span></p>
              <p style="margin: 0;"><strong style="color: #111827;">💬 Message:</strong></p>
              <div style="margin-top: 8px; padding: 15px; background: #ffffff; border-radius: 8px; border: 1px solid #e5e7eb; color: #374151; white-space: pre-wrap; font-size: 15px; line-height: 1.6;">
                ${message}
              </div>
            </div>
            <div style="text-align: center; margin-top: 30px;">
              <p style="font-size: 13px; color: #9ca3af; line-height: 1.5;">
                Sent automatically from DedicatedBlog contact form.<br />
                © ${new Date().getFullYear()} DedicatedBlog.
              </p>
            </div>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend delivery failure:", error);
      throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Failed to send email. Please try again later.");
    }

    return data;
  }
}
