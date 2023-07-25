const sgMail = require('@sendgrid/mail');
require('dotenv').config();  //read env

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendResetPassword = async (user, token) => {

  const msg = {
    to: user.email,
    from: 'zhengbill7@gmail.com',
    subject: 'Please reset your password',
    text: `Click the following link to reset your password: ${process.env.SERVER_URL}/change-password?token=${token}`,
    html: `<p>Click the following link to reset your password: <a href="${process.env.SERVER_URL}/change-password?token=${token}">${process.env.SERVER_URL}/change-password?token=${token}</a></p>`,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body)
    }
  }
}

module.exports = sendResetPassword;
