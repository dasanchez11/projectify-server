export interface JwtUser {
  token: string;
  firstname: string;
  email: string;
  userId: string;
  expiresAt: number;
}
