// Input validation utilities
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

export const validateName = (name) => {
  return name && name.trim().length >= 2 && name.trim().length <= 100;
};

export const validateTaskTitle = (title) => {
  return title && title.trim().length >= 3 && title.trim().length <= 200;
};

export const validateMongoId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

export const validateInputs = (data, requiredFields) => {
  const missingFields = requiredFields.filter(field => !data[field]);
  if (missingFields.length > 0) {
    return {
      valid: false,
      message: `Missing required fields: ${missingFields.join(", ")}`
    };
  }
  return { valid: true };
};
