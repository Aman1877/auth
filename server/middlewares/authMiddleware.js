import JWT from "jsonwebtoken";

export const verifyUser = async (req, res, next) => {
  try {
    const accesstoken = req.cookies.acessToken;
    if (!accesstoken) {
      if (await renewToken(req, res)) {
        next();
      }
    } else {
      JWT.verify(
        accesstoken,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
          if (err) {
            return res
              .status(500)
              .send({ valid: false, message: "Invalid Token" });
          } else {
            req.email = decoded.email;
            next();
          }
        }
      );
    }
  } catch (error) {
    console.log(error);
  }
};

const renewToken = async (req, res) => {
  try {
    const refreshtoken = req.cookies.refreshToken;
    let exist = false;
    if (!refreshtoken) {
      return res.send({ valid: false, message: "No Refresh token" });
    } else {
      JWT.verify(
        refreshtoken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
          if (err) {
            return res.send({ valid: false, message: "Invalid Refresh Token" });
          } else {
            const accessToken = JWT.sign(
              { email: decoded.email },
              process.env.ACCESS_TOKEN_SECRET,
              { expiresIn: "1m" }
            );
            res.cookie("accessToken", accessToken, { maxAge: 60000 });
            exist = true;
          }
        }
      );
    }
    return exist;
  } catch (error) {
    console.log(error);
  }
};
