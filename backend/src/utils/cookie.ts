import { Response } from 'express';

export const sendRefreshToken = (res: Response, token: string) => {
  // Cast res to any to access cookie method
  (res as any).cookie('jid', token, {
    httpOnly: true,
    path: '/', // Set to root so it's sent to /api/auth/refresh
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

export const clearRefreshToken = (res: Response) => {
  // Cast res to any to access clearCookie method
  (res as any).clearCookie("jid", { path: "/" });
}