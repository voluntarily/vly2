const Opportunity = require('./opportunity')

const initialOps = function () {
  Opportunity.estimatedDocumentCount().exec(count => {
    if (count > 0) {
      return
    }

    const oppos = [
      new Opportunity({
        title: 'Growing in the garden',
        subtitle: 'Growing digitally in the garden',
        imgUrl: 'https://c.pxhere.com/photos/84/ac/garden_water_sprinkler_soil_lettuce_grow_agriculture_floral-561591.jpg!d',
        description: 'Project to grow something in the garden',
        duration: '15 Minutes',
        location: 'Newmarket, Auckland',
        status: 'draft'
      }),
      new Opportunity({
        title: 'The first 100 metres',
        subtitle: 'Launching into space',
        imgUrl: 'https://images.sunlive.co.nz/images/170705-st-marys-school-rockets1.jpg',
        description: 'Project to build a simple rocket that will reach 100m',
        duration: '2 hours',
        location: 'Albany, Auckland',
        status: 'draft'
      })

    ]

    Opportunity.create(oppos, (error) => {
      if (!error) {
      //  console.log('Loaded Activities....');
      }
    })
  })
}
module.exports = initialOps
