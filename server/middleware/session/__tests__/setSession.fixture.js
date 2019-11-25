var jwt = require('jsonwebtoken')

const jwtData = {
  accessToken: 'IGs4bjO5WLjsulmjKiW2-VLeetlgykUP',
  idTokenPayload: {
    at_hash: 'ndwC4GRe-LrlVJ7LS_SdAg',
    aud: 'TsRPTVINZVOdao2Lf7EU8sPDkVZ3VQJY',
    email: 'andrew@groat.nz',
    email_verified: true,
    exp: Math.floor(Date.now() / 1000) + (60 * 60),
    iat: Math.floor(Date.now() / 1000),
    iss: 'https://dev-x6k-p15l.au.auth0.com/',
    name: 'Andrew Watkins',
    nickname: 'avowkind',
    nonce: 'auwvoOsJ6epNTXkfKu_btcr.mox2afqQ',
    picture: 'https://avatars2.githubusercontent.com/u/1596437?v=4',
    sub: 'github|1596437',
    updated_at: '2019-05-23T23:15:46.360Z',
    appState: null
  },
  refreshToken: null,
  state: 'Nz_CgRTnYPO5CbD4ueKmkdCiuk2z3psk',
  expiresIn: 3600,
  tokenType: 'Bearer',
  scope: null
}

jwtData.idToken = jwt.sign(jwtData.idTokenPayload, 'secret')

const jwtDataDali = {
  accessToken: 'IGs4bjO5WLjsulmjKiW2-VLeetlgykUP',
  idTokenPayload: {
    email: 'salvador@voluntarily.nz',
    email_verified: true,
    exp: Math.floor(Date.now() / 1000) + (60 * 60),
    iat: Math.floor(Date.now() / 1000),
    name: 'Salvador Domingo Felipe Jacinto Dalí i Domènech, 1st Marquis of Dalí de Púbol ',
    nickname: 'Dali',
    picture: 'https://avatars2.githubusercontent.com/u/1596437?v=4'
  },
  refreshToken: null,
  state: 'Nz_CgRTnYPO5CbD4ueKmkdCiuk2z3psk',
  expiresIn: 3600,
  tokenType: 'Bearer',
  scope: null
}
jwtDataDali.idToken = jwt.sign(jwtDataDali.idTokenPayload, 'secret')

const jwtDataAlice = {
  accessToken: 'IGs4bjO5WLjsulmjKiW2-VLeetlgykUP',
  idTokenPayload: {
    name: 'Alice Niceteacher',
    nickname: 'niceteacheralice',
    email: 'atesty@voluntarily.nz',
    email_verified: true,
    exp: Math.floor(Date.now() / 1000) + (60 * 60),
    iat: Math.floor(Date.now() / 1000),
    picture: 'https://publicdomainvectors.org/photos/teacher.png'
  },
  refreshToken: null,
  state: 'Nz_CgRTnYPO5CbD4ueKmkdCiuk2z3psk',
  expiresIn: 3600,
  tokenType: 'Bearer',
  scope: null
}
jwtDataAlice.idToken = jwt.sign(jwtDataAlice.idTokenPayload, 'secret')

const DEFAULT_SESSION = {
  isAuthenticated: false,
  user: null,
  me: null
}

module.exports = {
  jwtData, // represents andrew an admin
  jwtDataDali, // represents dali a normal volunteer
  jwtDataAlice, // represents Alice a teacher
  DEFAULT_SESSION
}
