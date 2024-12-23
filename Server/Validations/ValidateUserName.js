export const validateUsername = (userName) => {
  const usernamePattern = /^[A-Za-z0-9_]{8,}$/;
  return usernamePattern.test(userName);
};
