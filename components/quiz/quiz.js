import { Button, Divider, Radio, message } from 'antd'
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { sha256 } from 'js-sha256'
import callApi from '../../lib/callApi'

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

/* create a hash of the object by converting to a sorted array of
 key-value pairs, adding the key and output as a JSON string
 before using sha256 hash.
 hash is the same for all objects 1 level deep.
*/
export const hashObj = (obj, key) => {
  // canonicalise the object, so order of keys is consistent
  const canon = Object.keys(obj)
    .sort(function (a, b) { return a.localeCompare(b) })
    .map(key => [key, obj[key]])
  const a = { ...canon, key }
  const answerhash = sha256(JSON.stringify(a))
  return answerhash
}

export const hashObjVerify = (obj, key, hash) => {
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
    onSubmit(hashObjVerify(form, me.email, answers))
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
    </div>
  )
}

const issueBadge = async ({ _id, email }, badgeclass) => {
  const body = {
    _id,
    email
  }
  await callApi(`badge/${badgeclass}`, 'POST', body)
}

/* Show a video followed by some questions,
 when answers are correct issue a badge */
export const VideoQuiz = ({ vqa, me, onCompleted }) => {
  const handleSubmit = success => {
    if (success) {
      message.success('Success, issuing badge')
      if (vqa.badgeclass) { issueBadge(me, vqa.badgeclass) }
      onCompleted()
    } else {
      message.error('Incorrect - try again')
    }
  }
  return (
    <>
      <h1>{vqa.name}</h1>
      <p>{vqa.description}</p>
      <iframe style={{ margin: '2em' }} width='560' height='315' src={vqa.src} frameBorder='0' allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' allowFullScreen />
      <QuestionGroup questions={vqa.questions} answers={vqa.hash} me={me} onSubmit={handleSubmit} />
    </>
  )
}
