const Organisation = require('./organisation')

const initialOrganisations = function () {
  Organisation.estimatedDocumentCount().exec(count => {
    if (count > 0) {
      return
    }

    const orgList = [
      new Organisation({
        name: 'Admin',
        title: 'Voluntari.ly Administrators',
        slug: 'vly-admin',
        type: 'admin',
        about: "Voluntari.ly Administrators have special powers. Contact us to get things done that can't be done any other way"
      }),
      new Organisation({
        name: 'Datacom',
        title: 'Datacom etc etc',
        slug: 'datacom',
        type: 'corporate',
        about: 'some of our most loyal helpers'
      }),
      new Organisation({
        name: 'Spark Ltd',
        slug: 'spark',
        type: 'corporate',
        about: 'more of our most loyal helpers'
      }),
      new Organisation({
        name: 'Westpac Ltd',
        slug: 'westpac',
        type: 'corporate',
        about: 'even more of our most loyal helpers'
      }),
      new Organisation({
        name: 'Albany High School',
        slug: 'albany-high',
        type: 'school',
        about: 'A great place to learn'
      })

    ]

    Organisation.create(orgList, (error) => {
      if (!error) {
        //        console.log('Loaded Organisations....');
      }
    })
  })
}
module.exports = initialOrganisations
