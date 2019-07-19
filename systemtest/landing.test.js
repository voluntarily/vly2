import { ReactSelector, waitForReact } from 'testcafe-react-selectors'
const { config } = require('../config/config')

fixture`Getting Started` // eslint-disable-line no-undef
  .page`http://localhost:${config.serverPort}/`
  .beforeEach(async () => {
    await waitForReact()
  })

test('Test we can search from landing page', async t => { // eslint-disable-line no-undef
  await t
    .typeText(ReactSelector('Search'), 'robots')
    .pressKey('enter')
    .expect(ReactSelector('SearchPage TitleSectionSub').innerText, { timeout: 10000 }).eql('Search results for "robots"')
})
