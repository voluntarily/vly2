import test from 'ava'
import { hashObj, hashObjVerify, Question, QuestionGroup, VideoQuiz } from '../quiz'
import quiz from './quiz.fixture'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import fetchMock from 'fetch-mock'

// test.beforeEach(t => {
//   t.context.mockServer = fetchMock.sandbox()
//   global.fetch = t.context.mockServer
// })

// test.afterEach(t => {
//   fetchMock.reset()
// })

test('Check hash', t => {
  const blankHash = hashObj({}, '')
  t.is(blankHash, '0944d67c4d96fe949834700d0cb784b99ee5b0b6205b0667d842ece155405df2')
  const obj = {
    firstItem: 0,
    secondItem: 'Hello',
    thirdItem: 2
  }
  const key = 'testy@voluntarily.nz'
  const hash = hashObj(obj, key)

  t.is(hash, 'b5b7a329de8bf15913d6c46bc6d8af082e13c0a374c9cc30364853d887e367f5')

  // check equivalent object in different order.
  const obj2 = {
    secondItem: 'Hello',
    firstItem: 0,
    thirdItem: 2
  }
  const hash2 = hashObj(obj2, key)
  t.is(hash2, hash)
  t.true(hashObjVerify(obj2, key, hash))

  // check nested object
  const obj3 = {
    obj1: obj,
    obj2: obj2
  }
  const hash3 = hashObj(obj3, key)
  t.is(hash3, 'ba32b83d0cdc5546a7d0bba85c8419602b70e4b695d41cc70afba718b3e65e2c')

  // check nested object
  const obj4 = {
    obj1: obj2,
    obj2: obj
  }
  t.false(hashObjVerify(obj4, key, hash3))

  //  false if key changes
  t.false(hashObjVerify(obj2, 'testy2@voluntarily.nz', hash))
  // false if data changes
  obj2.firstItem = 1
  t.false(hashObjVerify(obj2, key, hash))
})

test('Check Question', t => {
  const handleUpdateField = sinon.spy()
  const q = quiz[0]
  const question = q.questions[0]
  const values = {
    tShirt: 1
  }
  const wrapper = shallow(
    <Question q={question} a={values} onChange={handleUpdateField} />
  )
  t.is(wrapper.find('p').first().text(), question.q)
  t.is(wrapper.find('Radio').length, 4)
})

test('Check QuestionGroup', t => {
  const handleSubmit = sinon.spy()
  const me = {
    email: 'testy@voluntarily.nz'
  }

  const q = quiz[0]
  const hashedAnswers = hashObj(q.answers, me.email)

  const wrapper = shallow(
    <QuestionGroup questions={q.questions} answers={hashedAnswers} me={me} onSubmit={handleSubmit} />
  )
  t.true(wrapper.exists('Button'))
  t.is(wrapper.find('Question').length, 4)
  const e1 = {
    preventDefault: sinon.spy(),
    target: {
      name: q.questions[0].name,
      value: 0
    }
  }
  const e2 = {
    target: {
      name: q.questions[1].name,
      value: 0
    }
  }
  const e3 = {
    preventDefault: sinon.spy()

  }
  // select two answers and submit
  wrapper.find('Question').at(0).props().onChange(e1)
  wrapper.find('Question').at(1).props().onChange(e2)
  wrapper.find('Button').first().props().onClick(e3)

  t.true(handleSubmit.calledWith(false))

  // change to the correct answer
  e1.target.value = 1
  wrapper.find('Question').at(0).props().onChange(e1)
  wrapper.find('Button').first().props().onClick(e3)
  t.true(handleSubmit.calledWith(false))
})

test('Check VideoQuiz', async t => {
  const q = quiz[0]
  const badgeclass = q.badgeclass
  const mockServer = fetchMock.sandbox()
  global.fetch = mockServer
  const result = { status: 200 }
  mockServer.post(`path:/api/badge/${badgeclass}`, JSON.stringify(result))

  const handleCompleted = sinon.spy()
  const me = {
    email: 'testy@voluntarily.nz'
  }

  const wrapper = shallow(
    <VideoQuiz vqa={q} me={me} onCompleted={handleCompleted} />
  )
  t.is(wrapper.find('h1').first().text(), q.name)
  t.is(wrapper.find('p').first().text(), q.description)
  t.is(wrapper.find('iframe').props().src, q.src)
  t.true(wrapper.exists('QuestionGroup'))
  const qg = wrapper.find('QuestionGroup').first()
  await qg.props().onSubmit(false)
  await qg.props().onSubmit(true)
  t.true(handleCompleted.calledOnce)
  t.true(mockServer.done())
})
