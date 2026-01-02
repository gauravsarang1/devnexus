import z from 'zod';

export const loginSchema = z.object({
  body: z.object({
    emailORUid: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
  }),
});

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(3, { message: "Name must be more than 3 charactors"}).max(20, { message: "Name must be less than 20 charactors"}),
    email: z.string().email({ message: 'Invalid email address' }),
    uId: z.string().min(4, { message: 'User ID must be at least 4 characters long' }),
    bio: z.string().optional(),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
  }),
});

export const verifyEmailOtpSchema = z.object({
  body: z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    otp: z.string().length(6, { message: 'OTP must be 6 digits long' }),
  }),
});

