import http from 'k6/http'
import { check, sleep } from 'k6'
import { Rate } from 'k6/metrics'

const host = 'https://gamma.voluntarily.nz'
export const errorRate = new Rate('errors')
export const options = {
  vus: 100,
  duration: '10s',
  noUsageReport: true,
  // summaryTrendStats: ['avg', 'p(95)'],
  thresholds: {
    http_req_duration: ['p(90)<2000'], // 90% of requests must complete below 1.5s
    errors: ['rate<0.01'] // <10% errors
  }
}
export default function ApiOrgs () {
  const res = http.get(`${host}/api/organisations?p=name`)
  const pass = check(res, {
    'status was 200': r => r.status === 200,
    'count org results': r => {
      return JSON.parse(r.body).length >= 110
    }
  })
  errorRate.add(!pass)
  sleep(1)
}
