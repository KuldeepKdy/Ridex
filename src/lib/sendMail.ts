import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.Email,
      pass: process.env.PASS
    },
  });

  export const sendMail = async (to: string, subject: string, html: string) => {
    try {
      await transporter.sendMail({
        from: `"Ridex" <${process.env.Email}>`,
        to,
        subject,
        html,
      });
    } catch (error) {
        console.log(error);
    }
};