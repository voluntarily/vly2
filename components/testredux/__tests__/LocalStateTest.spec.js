import test from 'ava'
import LocalStateTest from '../LocalStateTest'
import { shallow, mount } from 'enzyme'

/*
  Test that the component
  - renders properly
  - input text into the field
  - updates the state
  - result appears in the output
*/

/* shallow render does not expand child components so we don't see inside the Hello COmponent.
  expecting something like:

const _res = `
  <div>
    <Hello name="World" />
    <label>
      Name:
      <input type="text" id="editname" name="editname" onChange={[Function]} defaultValue="" size="20" />
    </label>
    <button type="submit" onClick={[Function]}>
      Save
    </button>
    <hr />
    <code>
      {&quot;editname&quot;:&quot;&quot;,&quot;savedname&quot;:&quot;World&quot;}
    </code>
  </div>`
*/

test('shallow properly', t => {
  // with shallow we end up with a string to validate but no functionality.
  const wrapper = shallow(<LocalStateTest />)
  t.truthy(wrapper.find('Hello[name="World"]').first())
  t.truthy(wrapper.find('input#editname').first().exists())
})

test('can input text and see result', t => {
  // we use mount so that event handling works
  const wrapper = mount(<LocalStateTest />)

  // push text into the input field and trigger onChange event.
  wrapper.find('input#editname').first()
    .simulate('change', { target: { name: 'editname', value: 'Andrew' } })

  // state debug section should show text in the editname.
  t.truthy(wrapper.find('code').first().text(), '{"editname":"Andrew","savedname":"World"}')

  // now click the save button.
  wrapper.find('button').first().simulate('click')

  // Hello class updates with the new text
  t.is(wrapper.find('h2').text(), 'Hello, Andrew')
})
