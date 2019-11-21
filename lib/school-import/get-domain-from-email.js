const getDomainFromEmail = (email) => {
  return email.split('@').pop()
}

module.exports = getDomainFromEmail
