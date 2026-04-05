import Mailgen from "mailgen";

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

export { emailVerificationMailgenContent, forgotPasswordMailgenContent };
