const { I } = inject();

module.exports = {

  // insert your locators and methods here
  checkOfferPageAnon () {
    I.seeElement({react: 'ActBanner'})
    I.seeElement({react: 'ActTabs'})
    I.seeElement({react: 'ActAboutPanel'})
    I.seeElement({react: 'ActOpsPanel'})
    I.seeElement({react: 'OpList'})
    // I.seeElement({react: 'OpAddOfferButton'})
  }
}
