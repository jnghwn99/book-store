import jwt from 'jsonwebtoken';

export const decodeJwt = (req, res) => {
  try {
    const receivedJwtToken = req.headers.authorization;
    // if (!receivedJwtToken) {
    //   throw new Error('Token not found');
    // }

    const decodedJwtToken = jwt.verify(
      receivedJwtToken,
      process.env.PRIVATE_KEY,
    );

    return decodedJwtToken;
  } catch (error) {
    console.error(error);
    return error;
  }
};
