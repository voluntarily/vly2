// React Components can be very very terse
import { useState, useEffect } from 'react'
import styled from 'styled-components'

const Demo = styled.div`

  p {
    width: 40rem;
    margin-bottom: 1rem;
  }
  label {
    text-align: right;
    margin-bottom: 1rem;
    display: inline-block;
    width: 5rem;
  }    
  input {
    display: inline-block;
    width: 4rem;
    margin-left: 0.2rem;
  }
`
const Block = styled.div`
  width: 4rem;
  height: 4rem;
  background-color: rebeccapurple;
  color: white;
  margin: 0.2rem;
  display: inline-block;
  vertical-align: middle;
  text-align: center;
  font-size: 1.8em;
`
const Centred = styled.span`
  display: inline-block;
  vertical-align: middle;
  line-height: 4rem; 
`
/* When passed a list of block objects display them in a grid of squares
  blocks - array of numbers
  limit - 0=show all, n= show n items
 */
const BlockList = ({ limit, blocks }) => {
  return (
    <>
      {blocks
        .filter((_item, index) => limit === '0' || (index < limit))
        .map((item, index) => {
          return (<Block key={index}><Centred>{item}</Centred></Block>)
        })}
    </>
  )
}

export const HooksExample = () => {
  const [expand, setExpand] = useState(false)
  const [limit, setLimit] = useState('4')
  const [count, setCount] = useState('10')
  const [blocks, setBlocks] = useState([])

  useEffect(() => {
    const arr = Array.from({ length: count }, (v, k) => k + 1)
    setBlocks(arr)
  }, [count])

  return (
    <Demo>
      <h2>useState</h2>
      <p>
        <em>useState</em> allows us to have a simple variable in the function
        that we can display or use to control viewing
        and then set the state of the variable when event occur such as
        onClick or onChange in inputs.
      </p>
      <p>
        <button style={{ width: '4rem' }} onClick={() => setExpand(!expand)}>{expand ? 'on' : 'off'}</button>
        <span style={{ marginLeft: '2rem' }}>Expand State = {expand ? 'true' : 'false'}</span>
      </p>
      <h2>useEffect</h2>
      <p>
        <em>useEffect</em> allows us to have a function that is called whenever some controlled state changes.
        If we then update state in the function the component is rendered again updating
        any elements that depend on the new value.
      </p>
      <p>
        <label>Count:</label>
        <input value={count} onChange={(e) => setCount(e.target.value)} /><br />
        <label>Limit:</label>
        <input value={limit} onChange={(e) => setLimit(e.target.value)} />
      </p>
      <h2>BlockList</h2>
      <p>The block display depends on the value of limit and the value of expand.
        If expand is true we pass in 0 if it is false we pass in the <em>{limit}</em> value
      </p>
      <BlockList limit={expand ? '0' : limit} blocks={blocks} />
    </Demo>
  )
}

export default HooksExample
