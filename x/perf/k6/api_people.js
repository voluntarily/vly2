import http from 'k6/http'
import { check, sleep } from 'k6'
import { Rate } from 'k6/metrics'

const host = 'https://gamma.voluntarily.nz'
export const errorRate = new Rate('errors')
export const options = {
  vus: 20,
  duration: '30s',
  noUsageReport: true,
  // summaryTrendStats: ['avg', 'p(95)'],
  thresholds: {
    http_req_duration: ['p(90)<8000'], // 90% of requests must complete below 1.5s
    errors: ['rate<0.01'] // <10% errors
  }
}
export default function ApiPeople () {
  const query = JSON.stringify({ tags: 'fortran' })
  const options = {
    headers: {
      Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik5qSkVRelJGUkRkR01VTTNNemMwUVRreU4wSXpSamhDUlVGRU9FSTFRa0ZCUXprNFJEaEdSQSJ9.eyJuaWNrbmFtZSI6InZwbWVtYmVyMSIsIm5hbWUiOiJWUCBNZW1iZXIgMSIsInBpY3R1cmUiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci85NTk2ODI3NzNlMjQ4ZjdhNmFiNzk3YWFjNWMzNDc3ND9zPTQ4MCZyPXBnJmQ9aHR0cHMlM0ElMkYlMkZjZG4uYXV0aDAuY29tJTJGYXZhdGFycyUyRnZwLnBuZyIsInVwZGF0ZWRfYXQiOiIyMDIwLTAzLTE4VDIxOjU1OjQ1LjU1M1oiLCJlbWFpbCI6InZwbWVtYmVyMUBtYWlsaW5hdG9yLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczovL3ZvbHVudGFyaWx5LmF1LmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw1ZTUyZmQxNzY2OGY4MjBjZjc0M2RmNDEiLCJhdWQiOiJTNHlkNFZnWjkyTklqaHdPM3Z0NGgwR2lmYjltWHYxayIsImlhdCI6MTU4NDU3NDQ3MywiZXhwIjoxNTg1NDM4NDczLCJhdF9oYXNoIjoiOHJLbWNFdnNERzU3LWxiaUxHbUNIZyIsIm5vbmNlIjoiajNHZlRwLlZzeUdBfkw1ZkUyZlRPVi5IUm1lakxaQ2QifQ.crOzYTcY2nSUq3Z01p9mYorrIR-g-FAg0Xan4jdJJq8BFdDPq9J1GpmEbVuORT_ZQE5QQBqTPTtQnSNv0GtD49JgIQPNAj_YA_DRj_vZauRS121GtbNggKwFW2ajJ8O8znuDskuIphXMiyvAqjbMuu0GfO3I4p0jWlw-0Bh8dnqzRGct8K3dKCSwoDDx5W3aeLKn5QRIh8r0nWHEIsml4OU_EkRPHY6xp229Fs9C9pR6Y3A5MZTGWkBXtO58AOBttQK7Ftu0yX2JWm9NYZIIUxVwugtidaRLx-QvhJ4AsgA8ZMt8obiyaaLtmj3mm1C9B0Khe_2BFewN_2hD3xB0YA',
      'Content-Type': 'application/json'
    }
  }
  const res = http.get(`${host}/api/people?q=${query}&p="name"`, options)
  check(res, {
    'status was 200': r => r.status === 200,
    'count results': r => {
      const people = JSON.parse(r.body)
      return people.length >= 1500
    }
  }) || errorRate.add(1)
  sleep(1)
}
