//receive and transform request then send a response;
export const authController = async (req, res, next) => {
  //Breaker header
  const cookie = req.get("Authorization").split(" ")[1];

  //const data = await VerifyUserSession(cookie);

  //res.json({ data });
};
