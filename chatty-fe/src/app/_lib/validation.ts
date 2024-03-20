export const validateEmail = (email: string) => {
  const regex = /\S+@\S+\.\S+/;
  return regex.test(email);
};

export const validatePassword = (password: string) => {
  const minLength = 8;
  return password.length >= minLength;
};
