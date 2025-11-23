export const encryptString = (text: string) => {
  return btoa(text);
};

export const decryptString = (cipher: string) => {
  return atob(cipher);
};
