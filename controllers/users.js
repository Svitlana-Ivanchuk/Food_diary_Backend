const { ctrlWrapper } = require('../helpers');

const getCurrent = async (req, res) => {
  const { email, name } = req.user;
  console.log(req);

  res.status(200).json({ email, name });
};

module.exports = {
  getCurrent: ctrlWrapper(getCurrent),
};
