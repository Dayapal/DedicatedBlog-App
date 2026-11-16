/**
 * Recursively strips keys starting with '$' or containing '.' to mitigate NoSQL injection attacks.
 */
const cleanObject = (obj) => {
  if (!obj || typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map(cleanObject);
  }

  const cleaned = {};
  for (const [key, value] of Object.entries(obj)) {
    // Drop keys containing '$' or '.'
    if (key.startsWith("$") || key.includes(".")) {
      continue;
    }
    cleaned[key] = cleanObject(value);
  }
  return cleaned;
};

export const mongoSanitize = (req, res, next) => {
  if (req.body) req.body = cleanObject(req.body);
  if (req.params) req.params = cleanObject(req.params);
  // req.query might be read-only in Express 5, so handle carefully
  try {
    if (req.query) req.query = cleanObject(req.query);
  } catch (_) {
    // If req.query is a getter/frozen in Express 5, skip re-assignment
  }
  next();
};
