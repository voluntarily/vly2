import http from 'k6/http'
import { parseHTML } from 'k6/html'
import { check, sleep } from 'k6'
import { Rate } from 'k6/metrics'

const host = 'https://gamma.voluntarily.nz'
export const errorRate = new Rate('errors')
export const options = {
  vus: 10,
  duration: '20s',
  noUsageReport: true,
  // summaryTrendStats: ['avg', 'p(95)'],
  thresholds: {
    http_req_duration: ['p(90)<500'], // 90% of requests must complete below 1.5s
    errors: ['rate<0.01'] // <1% errors
  }
}
export default function PageSearch () {
  const res = http.get(`${host}/search?search=fortran`)

  const pass = check(res, {
    'status was 200': r => r.status === 200,
    'page title': r => {
      const doc = parseHTML(res.body)
      const pageTitle = doc.find('h2').text()
      return pageTitle === 'Search results for "fortran"'
    }
  })
  errorRate.add(!pass)
  sleep(1)
}
