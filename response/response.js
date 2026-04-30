// response/response.js
export const sendSuccess = (res, message, status, data = {}) => {
  return res.status(status).json({
    success: true,
    message,
    data
  });
};

export const sendFail = (res, message, status) => {
  return res.status(status).json({
    success: false,
    message
  });
};