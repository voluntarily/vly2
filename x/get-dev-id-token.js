const jwt = require('jsonwebtoken')

/**
 * get-dev-id-token.js
 *
 * This script accepts two arguments and generates an idToken based on them.
 *
 * Usage: node x/get-dev-id-token.js <email_address> <optional_expiry_in_seconds>
 *
 * If the optional expiry argument is not included tokens will be generated with
 * an expiry 1 hour in the future.
 *
 * To use this token create/update a new cookie when viewing Voluntarily in your browser.
 * The name of the cookie should be "idToken" the value of the cookie should be the token
 * that this script generates. Once you've set the cookie up, refresh the window and you
 * should be logged in using the newly generated token.
 */

async function main () {
  const email = process.argv[2]

  if (!email) {
    console.log('Please provide an email address')
    console.log('e.g. node x/get-dev-id-token.js test@example.com\n')
    console.log('Note: the email address should match an existing person record for logins to work\n')
    console.log('You can optional provided a 2nd argument that will set the expiry time on the token.')
    console.log('e.g. node x/get-dev-id-token.js test@example.com 3600 # create token that expires in 1 hour')
    console.log('or:  node x/get-dev-id-token.js test@example.com -3600 # create token that expired 1 hour ago\n')
    process.exit(1)
  }

  let expires = (60 * 60) // default to expire 1 hour in future

  if (process.argv[3]) {
    expires = parseInt(process.argv[3])
  }

  const payload = {
    email: email,
    email_verified: true,
    exp: Math.floor(Date.now() / 1000) + expires,
    iat: Math.floor(Date.now() / 1000),
    name: '',
    nickname: '',
    picture: ''
  }

  const idToken = jwt.sign(payload, 'dev', { keyid: 'dev' })

  console.log('Your token is:\n')
  console.log('-------------------------')
  console.log(idToken)
  console.log('-------------------------')
  process.exit(0)
}

main()
