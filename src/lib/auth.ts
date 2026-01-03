import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer"


// For production, replace with your actual SMTP server details.
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASSWORD,
  },
});
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    trustedOrigins:[process.env.APP_URL!],
    user:{
     additionalFields:{
        role:{
            type:'string',
            defaultValue:'USER',
            required: false
        },
        phone:{
            type:'string',
            required:false
        },
        status:{
            type:'string',
            defaultValue:'ACTIVE',
            required: false
        }
     }
    },

    emailAndPassword: { 
    enabled: true, 
    autoSignIn:false,
    requireEmailVerification: true
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification:true,
    sendVerificationEmail: async ( { user, url, token }, request) => {

       try {
         // console.log({user,url,token});
        const verificationUrl= `${process.env.APP_URL}/verify-email?token=${token}`
        
      console.log('Verification email sent');
      const info = await transporter.sendMail({
    from: '"Prisma Blog Team" <prismablog@gmail.com>',
    to: user.email,
    subject: "Email Verification",
    // text: "Hello world?", // Plain-text version of the message
    html: `
    <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Email Verification</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>

<body style="margin:0; padding:0; background:#f4f6fa; font-family:Arial, Helvetica, sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;">
          
          <tr>
            <td align="center" style="background:#4f46e5;padding:20px 0;">
              <h2 style="color:white;margin:0;">Verify Your Email</h2>
            </td>
          </tr>

          <tr>
            <td style="padding:30px;">
              <p style="font-size:16px;color:#333;">
                Hi ${user.name}, <br><br>
                Thanks for signing up! Please confirm your email address to activate your account.
              </p>

              <p style="text-align:center;margin:35px 0;">
                <a href="${verificationUrl}" 
                   style="background:#4f46e5;color:white;text-decoration:none;
                          padding:12px 22px;border-radius:6px;font-size:16px;display:inline-block;">
                  Verify Email
                </a>
              </p>

              <p style="color:#555;font-size:14px;">
                If the button doesn’t work, copy and paste the following link into your browser:
              </p>

              <p style="word-break:break-all;color:#4f46e5;font-size:14px;">
               ${verificationUrl}
              </p>

              <p style="font-size:14px;color:#777;margin-top:30px;">
                If you didn’t create this account, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <tr>
            <td align="center" style="background:#f1f1f1;padding:15px;color:#666;font-size:13px;">
              © 2025 Prisma Blog — All rights reserved
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
  });
      console.log("Message sent:", info.messageId);
       } catch (error: any) {
        console.log(error.message);
        throw error
        
       }
    },
  },
 socialProviders: {
        google: {  
            prompt:"select_account consent",
            accessType:"offline",
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },
});