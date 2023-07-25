const sgMail = require('@sendgrid/mail');
require('dotenv').config();  //read env

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendVerificationEmail = async (user, token) => {

  const msg = {
    to: user.email,
    from: 'zhengbill7@gmail.com',
    subject: 'Please confirm your email',
    text: `Click the following link to confirm your email: ${process.env.SERVER_URL}/confirm-email?token=${token}`,
    html: `<p>Click the following link to confirm your email: <a href="${process.env.SERVER_URL}/confirm-email?token=${token}">${process.env.SERVER_URL}/confirm-email?token=${token}</a></p>`,
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

module.exports = sendVerificationEmail;
