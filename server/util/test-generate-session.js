const jwt = require('jsonwebtoken')

const generateTestSession = (name, email) => {
  const session = {
    accessToken: 'IGs4bjO5WLjsulmjKiW2-VLeetlgykUP',
    idTokenPayload: {
      email: email,
      email_verified: true,
      exp: Math.floor(Date.now() / 1000) + (60 * 60),
      iat: Math.floor(Date.now() / 1000),
      name: name,
      nickname: '',
      picture: ''
    },
    refreshToken: null,
    state: 'Nz_CgRTnYPO5CbD4ueKmkdCiuk2z3psk',
    expiresIn: 3600,
    tokenType: 'Bearer',
    scope: null
  }

  session.idToken = jwt.sign(session.idTokenPayload, 'secret')

  return session
}

module.exports = {
  generateTestSession
}
