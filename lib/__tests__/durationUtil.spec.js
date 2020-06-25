import test from 'ava'
import { displayDuration } from '../durationUtil'

test('displayDuration - ISO 8601 duration string - plural hours and minutes', t => {
  t.is(displayDuration('PT2H25M'), '2 hours 25 minutes')
})

test('displayDuration - ISO 8601 duration string - single hours and minutes', t => {
  t.is(displayDuration('PT1H1M'), '1 hour 1 minute')
})

test('displayDuration - ISO 8601 duration string - no hours', t => {
  t.is(displayDuration('PT5M'), '5 minutes')
})

test('displayDuration - ISO 8601 duration string - no minutes', t => {
  t.is(displayDuration('PT5H'), '5 hours')
})

test('displayDuration - Free text duration string', t => {
  t.is(displayDuration('1 hour and 25 minutes and some seconds'), '1 hour and 25 minutes and some seconds')
})
