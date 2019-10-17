import { Email, Item, Span, A, renderEmail } from 'react-html-email'

const emailHTML = renderEmail(
  <Email title='Hello World!'>
    <Item align='center'>
      <Span fontSize={20}>
        This is an example email made with:
        <A href='https://github.com/chromakode/react-html-email'>react-html-email</A>.
      </Span>
    </Item>
  </Email>
)

export default emailHTML
