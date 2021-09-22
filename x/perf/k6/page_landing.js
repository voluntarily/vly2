import http from 'k6/http'
import { parseHTML } from 'k6/html'
import { check, sleep } from 'k6'
import { Rate } from 'k6/metrics'

const host = 'https://gamma.voluntarily.nz'
export const errorRate = new Rate('errors')
export const options = {
  vus: 20,
  duration: '20s',
  noUsageReport: true,
  // summaryTrendStats: ['avg', 'p(95)'],
  thresholds: {
    http_req_duration: ['p(90)<500'], // 90% of requests must complete below 1.5s
    errors: ['rate<0.01'] // <1% errors
  }
}
export default function PageLanding () {
  const res = http.get(`${host}/landing`)

  const pass = check(res, {
    'status was 200': r => r.status === 200,
    'page title': r => {
      const doc = parseHTML(res.body)
      const pageTitle = doc.find('h1').text()
      return pageTitle === 'We make it easy to volunteer 🥳'
    }
  })
  errorRate.add(!pass)
  sleep(1)
}
