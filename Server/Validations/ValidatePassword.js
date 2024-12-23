export const validatePassword = (password) => {
  const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return passwordPattern.test(password);
};
