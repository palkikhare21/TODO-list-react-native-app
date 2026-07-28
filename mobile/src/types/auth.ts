export type User = {
  id: string;
  email: string;
};

export type AuthResponse = {
  accessToken: string;
  user: User;
};
