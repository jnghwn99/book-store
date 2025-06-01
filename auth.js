import jwt from 'jsonwebtoken';

export const decodeJwt = (req, res) => {
  try {
    const receivedJwtToken = req.headers.authorization;

    if (receivedJwtToken) {
      const decodedJwtToken = jwt.verify(
        receivedJwtToken,
        process.env.PRIVATE_KEY,
      );
      return decodedJwtToken;
    } else {
      throw new ReferenceError('jwt must be provided');
    }
  } catch (error) {
    console.error(error);
    return error;
  }
};
