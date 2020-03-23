import { waitForReact } from 'testcafe-react-selectors'
const { config } = require('../config/clientConfig')

fixture`Getting Started` // eslint-disable-line no-undef
  .page`http://localhost:${config.serverPort}/`
  .beforeEach(async () => {
    await waitForReact(30000)
  })

test('Test we can search from landing page', async t => { // eslint-disable-line no-undef
//   await t
//     .typeText(ReactSelector('Search'), 'robots')
//     .pressKey('enter')
//     .expect(ReactSelector('SearchPage SectionSubtitle').innerText, { timeout: 10000 }).eql('Search results for "robots"')
})
