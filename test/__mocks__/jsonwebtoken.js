const jwt = {
  verify: (token, secret) => {
    if (!token) throw new Error("Invalid token");
    return { email: "test@test.com", iat: 1234567890, exp: 9999999999 };
  },
  sign: (payload, secret, options = {}) => "mocked-jwt-token",
};

module.exports = jwt;
