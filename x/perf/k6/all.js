import http from 'k6/http'
import { check, group, sleep } from 'k6'

// const USERNAME = `${randomString(10)}@example.com` // Set your own email or `${randomString(10)}@example.com`;
// const PASSWORD = 'superCroc2019'
const BASE_URL = 'https://gamma.voluntarily.nz'

export const options = {
  stages: [
    { target: 70, duration: '30s' }
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1500'],
    'http_req_duration{name:PublicCrocs}': ['avg<400'],
    'http_req_duration{name:Create}': ['avg<600', 'max<1000']
  }
}

function randomString (length) {
  const charset = 'abcdefghijklmnopqrstuvwxyz'
  let res = ''
  while (length--) res += charset[Math.random() * charset.length | 0]
  return res
}

export const K6All = (authToken) => {
  const requestConfigWithTag = tag => ({
    headers: {
      Authorization: `Bearer ${authToken}`
    },
    tags: Object.assign({}, {
      name: 'PrivateCrocs'
    }, tag)
  })

  group('Public endpoints', () => {
    // call some api endpoints in a batch
    const responses = http.batch([
      ['GET', `${BASE_URL}/api/orgs`, null, { tags: { name: 'PublicCrocs' } }],
      ['GET', `${BASE_URL}/public/crocodiles/2/`, null, { tags: { name: 'PublicCrocs' } }],
      ['GET', `${BASE_URL}/public/crocodiles/3/`, null, { tags: { name: 'PublicCrocs' } }],
      ['GET', `${BASE_URL}/public/crocodiles/4/`, null, { tags: { name: 'PublicCrocs' } }]
    ])

    const ages = Object.values(responses).map(res => res.json('age'))

    // Functional test: check that all the public crocodiles are older than 5
    check(ages, {
      'Crocs are older than 5 years of age': Math.min(...ages) > 5
    })
  })

  group('Create and modify crocs', () => {
    let URL = `${BASE_URL}/my/crocodiles/`

    group('Create crocs', () => {
      const payload = {
        name: `Name ${randomString(10)}`,
        sex: 'M',
        date_of_birth: '2001-01-01'
      }

      const res = http.post(URL, payload, requestConfigWithTag({ name: 'Create' }))

      if (check(res, { 'Croc created correctly': (r) => r.status === 201 })) {
        URL = `${URL}${res.json('id')}/`
      } else {
        console.log(`Unable to create a Croc ${res.status} ${res.body}`)
      }
    })

    group('Update croc', () => {
      const payload = { name: 'New name' }
      const res = http.patch(URL, payload, requestConfigWithTag({ name: 'Update' }))
      const isSuccessfulUpdate = check(res, {
        'Update worked': () => res.status === 200,
        'Updated name is correct': () => res.json('name') === 'New name'
      })

      if (!isSuccessfulUpdate) {
        console.log(`Unable to update the croc ${res.status} ${res.body}`)
      }
    })

    const delRes = http.del(URL, null, requestConfigWithTag({ name: 'Delete' }))

    const isSuccessfulDelete = check(null, {
      'Croc was deleted correctly': () => delRes.status === 204
    })

    if (!isSuccessfulDelete) {
      console.log('Croc was not deleted properly')
    }
  })

  sleep(1)
}
export default K6All
