import { ContactService } from "../services/contact.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HTTP_STATUS } from "../constants/statusCodes.js";

export const handleContactMessage = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  await ContactService.sendContactMessage({ name, email, message });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "Message sent successfully!",
  });
});
