import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendEmail = async function (options) {
  if (!options.email || !options.subject || !options.mailgenContent) {
    throw new Error("Missing required email options");
  }

  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Project Camp",
      link: "https://github.com/ShauravBhatt/Project-Camp-Project-Management-Tool",
    },
  });

  const emailHtml = mailGenerator.generate(options.mailgenContent);
  const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);

  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: Number(process.env.MAILTRAP_SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.MAILTRAP_SMTP_USER,
      pass: process.env.MAILTRAP_SMTP_PASS,
    },
  });

  const email = {
    from: `'${process.env.EMAIL_FROM_NAME}' <${process.env.EMAIL_FROM}>`,
    to: options.email,
    subject: options.subject,
    text: emailTextual,
    html: emailHtml,
  };

  try {
    await transporter.sendMail(email);
    console.log("Email sent successfully");
  } catch (err) {
    console.error("Email failed: ", err.message);
    throw new Error("Email could not be sent");
  }
};

const emailVerificationMailgenContent = function (username, verificationUrl) {
  return {
    body: {
      name: username,
      intro: "Welcome to Project Camp! We're delighted to have you on board.",
      action: {
        instructions:
          "To complete your registration, please verify your email address by clicking the button below.",
        button: {
          text: "Verify Email",
          color: "#22BC66",
          link: verificationUrl,
        },
      },
      outro:
        "If you encounter any issues or have questions, feel free to reply to this email. We're here to help.",
    },
  };
};

const forgotPasswordMailgenContent = function (username, forgotPasswordUrl) {
  return {
    body: {
      name: username,
      intro:
        "We received a request to reset your password. If you did not initiate this request, please disregard this email.",
      action: {
        instructions:
          "To reset your password, please click the button below and follow the instructions.",
        button: {
          text: "Reset Password",
          color: "#FF6136",
          link: forgotPasswordUrl,
        },
      },
      outro:
        "If you experience any issues or need assistance, simply reply to this email and our support team will be happy to assist you.",
    },
  };
};

export { emailVerificationMailgenContent, forgotPasswordMailgenContent, sendEmail };
