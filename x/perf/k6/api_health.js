import http from 'k6/http'
import { check, sleep } from 'k6'

const host = 'https://gamma.voluntarily.nz'
export const options = {
  vus: 100,
  duration: '20s',
  thresholds: {
    http_req_duration: ['p(99)<1000'] // 99% of requests must complete below 1.5s
  }
}
export default function ApiHealth () {
  const res = http.get(`${host}/api/health`)

  check(res, {
    'status was 200': r => r.status === 200,
    'transaction time OK': r => r.timings.duration < 2000
  })
  sleep(1)
}
