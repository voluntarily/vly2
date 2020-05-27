Feature('landing')

Scenario('Anon visits landing page', (I) => {
  I.amOnPage('/')
  I.see('People helping people')
  I.seeElement('//a[contains(., "Sign in")]') // menu item
  I.seeElement('//button[contains(., "Get started")]') // button
  I.seeElement('//a[contains(., "Learn more")]')
  I.seeElement({ react: 'Hero', props: { isAuthenticated: false } })
})
