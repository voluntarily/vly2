import test from 'ava'
import Html from '../Html'
import { render } from 'enzyme'

test('Render Html p', t => {
  const content = '<p>Test</p>'
  const wrapper = render(<Html>{content}</Html>)
  t.is(wrapper.find('p').first().text(), 'Test')
})

test('Render Html nested', t => {
  const content = `
    <article>
    <main>
      <h1>Heading 1</h1>
      <p>Sed ut perspiciatis unde omnis iste natus error sit
        voluptatem accusantium doloremque laudantium, totam rem
        aperiam, eaque ipsa quae ab illo inventore veritatis et
        quasi architecto beatae vitae dicta sunt explicabo.
        Nemo enim ipsam voluptatem quia voluptas sit aspernatur
        aut odit aut fugit, sed quia consequuntur magni dolores eos
        qui ratione voluptatem sequi nesciunt. 
      </p>
      <p>
        Neque porro quisquam
        est, qui dolorem ipsum quia dolor sit amet, consectetur,
        adipisci velit, sed quia non numquam eius modi tempora
        incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
        Ut enim ad minima veniam, quis nostrum exercitationem ullam
        corporis suscipit laboriosam, nisi ut aliquid ex ea commodi
        consequatur? Quis autem vel eum iure reprehenderit qui in ea
        voluptate velit esse quam nihil molestiae consequatur,
        vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
      </p>
    </main>
  </article>
  `

  const wrapper = render(<Html>{content}</Html>)
  t.is(wrapper.find('h1').first().text(), 'Heading 1')
  t.is(wrapper.find('p').length, 2)
})
