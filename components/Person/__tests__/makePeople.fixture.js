import mongoose from 'mongoose'
import cuid from 'cuid'

const ObjectId = () => mongoose.Types.ObjectId().toHexString()

// sequence generator
export const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + (i * step))
export const gra = (min, max) => { return (Math.round(Math.random() * (max - min) + min)) }
export const coin = (a, b) => { return gra(0, 1) ? a : b }

const he = { subject: 'he', object: 'him', possessive: 'his' }
const she = { subject: 'she', object: 'her', possessive: 'her' }
const they = { subject: 'they', object: 'them', possessive: 'their' }
export const pronoun = () => {
  switch (gra(0, 2)) { case 0: return he; case 1: return she; case 2: return they }
}
export const makePerson = (role, name) => {
  const code = gra(1000, 9999)
  const nickname = `${role}_${name}_${code}`
  return ({
    _id: ObjectId(),
    name: `${role} ${name} ${code}`,
    nickname,
    email: `${nickname}@mailinator.com`,
    phone: `+64 9 555 ${code}`,
    sendEmailNotifications: true,
    pronoun: pronoun(),
    imgUrl: 'https://publicdomainvectors.org/photos/hand-6.png',
    imgUrlSm: 'https://publicdomainvectors.org/photos/hand-6.png',
    role,
    status: 'active'
  })
}

export const makeVolunteer = name => makePerson('volunteer', name)
export const makeTeacher = name => makePerson('opportunityProvider', name)
export const makeVolunteers = (name, count) => Array(count).fill({}).map(() => makeVolunteer(`${name}_${cuid()}`))
