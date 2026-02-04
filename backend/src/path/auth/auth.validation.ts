import z from "zod";

export const AuthValidation = {
  loginSchema: z.object({
    body: z.object({
      emailORUid: z.string().min(4, { message: "Please enter a valid email or user ID" }),
      password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" }),
    }),
  }),

  registerSchema: z.object({
    body: z.object({
      name: z
        .string()
        .min(3, { message: "Name must be more than 3 characters" })
        .max(20, { message: "Name must be less than 20 characters" }),

      email: z.string().email({ message: "Invalid email address" }),

      uId: z
        .string()
        .min(4, { message: "User ID must be at least 4 characters long" }),

      bio: z.string().optional(),

      password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" }),

      offeredSkills: z
        .array(z.string())
        .optional(),

      seekingSkills: z
        .array(z.string()).optional(),

      avatar: z.string().optional(),
      background: z.string().optional(),
    }),
  }),

  verifyEmailOtpSchema: z.object({
    body: z.object({
      email: z.string().email({ message: "Invalid email address" }),
      otp: z.string().length(6, { message: "OTP must be 6 digits long" }),
    }),
  }),

  requestForgetPassword: z.object({
    params: z.object({
      emailORuId: z.string()
    })
  }),

  forgetPasswordWithOTP: z.object({
    body: z.object({
      password: z.string().min(6),
      otp: z.string().length(6, { message: "OTP must be 6 digits long" }),
    }),
    params: z.object({
      emailORuId: z.string()
    })
  })

}

