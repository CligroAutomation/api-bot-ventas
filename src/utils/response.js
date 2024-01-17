export const errorResponse = (message) => {
  return {
    success: false,
    message,
  };
};

export const successResponse = (message, data = {}) => {
  return {
    success: true,
    message,
    data,
  };
};
