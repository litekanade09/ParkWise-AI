import { validationResult } from "express-validator";
import { sendError } from "../utils/response.js";

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorDetails = errors.array().reduce((acc, current) => {
      acc[current.path] = current.msg;
      return acc;
    }, {});
    return sendError(res, "Request Validation Failed", errorDetails, 400);
  }
  next();
};

export default validate;
