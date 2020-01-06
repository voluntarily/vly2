import { Button, Divider, Radio, message } from 'antd'
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { sha256 } from 'js-sha256'

const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px'
}

const Q = styled.div`
  p {
    margin-top: 2rem;
    font-weight: bold;
    display: block;
  }
`
export const hashObj = (obj, key) => {
  // must canonicalise the object
  const canon = Object.keys(obj)
    .sort(function (a, b) { return a.localeCompare(b) })
    .map(key => [key, obj[key]])
  const a = { ...canon, key }
  const answerhash = sha256(JSON.stringify(a))
  return answerhash
}

const checkObj = (obj, key, hash) => {
  return hashObj(obj, key) === hash
}

export const Question = ({ q, a, onChange }) => {
  return (
    <Q>
      <p>{q.q}</p>
      <Radio.Group
        name={q.name}
        onChange={onChange}
        value={a[q.name]}
      >
        {q.options.map((opt, index) =>
          <Radio key={index} value={index} style={radioStyle}>
            {opt}
          </Radio>
        )}
      </Radio.Group>
    </Q>
  )
}
export const QuestionGroup = ({ questions, answers, me, onSubmit }) => {
  const [form, setForm] = useState({})

  const checkAnswers = e => {
    e.preventDefault()

    if (checkObj(form, me.email, answers)) {
      message.success('Correct')
      onSubmit(true)
      // do the next thing
    } else {
      message.error('Incorrect - try again')
      onSubmit(false)
    }
  }

  const updateField = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div>
      {questions.map((q, index) =>
        <Question key={index} q={q} a={form} onChange={updateField} />
      )}
      <Divider />
      <Button onClick={checkAnswers} type='primary' shape='round' size='large'>
        <FormattedMessage
          id='QuestionGroup.submit'
          defaultMessage='Submit'
          description='Button Submit QuestionGroup answers'
        />
      </Button>
    </div>)
}

export const VideoQuestions = ({ vqa, me, onSubmit }) =>
  <>
    <h1>{vqa.name}</h1>
    <p>{vqa.description}</p>
    <iframe style={{ margin: '2em' }} width='560' height='315' src={vqa.src} frameBorder='0' allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' allowFullScreen />
    <QuestionGroup questions={vqa.questions} answers={vqa.hash} me={me} onSubmit={onSubmit} />
  </>
