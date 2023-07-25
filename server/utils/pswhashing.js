const bcrypt = require('bcrypt');

const Passwordhashing = async (password) => {
  const salt = await bcrypt.genSalt(10); //set the length to 10
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

module.exports = Passwordhashing;