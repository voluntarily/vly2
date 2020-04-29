// const suburbs = require('./locationSuburbsData')

// for now, this is hardcoded to all TLAs and regions in NZ
const regions = [
  {
    name: 'Northland',
    containedTerritories: [
      'Far North District',
      'Whangarei District',
      'Kaipara District'
    ]
  },
  {
    name: 'Auckland',
    containedTerritories: [] // auckland is a TLA and a region
  },
  {
    name: 'Waikato',
    containedTerritories: [
      'Thames-Coromandel District',
      'Hauraki District',
      'Waikato District',
      'Matamata-Piako District',
      'Hamilton City',
      'Waipa District',
      'Otorohanga District',
      'South Waikato District',
      'Waitomo District',
      'Taupo District'
    ]
  },
  {
    name: 'Bay of Plenty',
    containedTerritories: [
      'Western Bay of Plenty District',
      'Tauranga City',
      'Rotorua District',
      'Whakatane District',
      'Kawerau District',
      'Opotiki District'
    ]
  },
  {
    name: 'Gisborne',
    containedTerritories: [] // gisborne is a TLA and a region
  },
  {
    name: 'Hawke\'s Bay',
    containedTerritories: [
      'Wairoa District',
      'Hastings District',
      'Napier City',
      'Central Hawke\'s Bay District'
    ]
  },
  {
    name: 'Taranaki',
    containedTerritories: [
      'New Plymouth District',
      'Stratford District',
      'South Taranaki District'
    ]
  },
  {
    name: 'Manawatu-Wanganui',
    containedTerritories: [
      'Ruapehu District',
      'Whanganui District',
      'Rangitikei District',
      'Manawatu District',
      'Palmerston North City',
      'Tararua District',
      'Horowhenua District'
    ]
  },
  {
    name: 'Wellington',
    containedTerritories: [
      'Kapiti Coast District',
      'Porirua City',
      'Upper Hutt City',
      'Lower Hutt City',
      'Wellington City',
      'Masterton District',
      'Carterton District',
      'South Wairarapa District'
    ]
  },
  {
    name: 'Tasman',
    containedTerritories: [] // tasman is a TLA and a region
  },
  {
    name: 'Nelson',
    containedTerritories: [] // Nelson is a TLA and a region
  },
  {
    name: 'Marlborough',
    containedTerritories: [] // Marlborough is a TLA and a region
  },
  {
    name: 'West Coast',
    containedTerritories: [
      'Buller District',
      'Grey District',
      'Westland District'
    ]
  },
  {
    name: 'Canterbury',
    containedTerritories: [
      'Kaikoura District',
      'Hurunui District',
      'Waimakariri District',
      'Christchurch City',
      'Selwyn District',
      'Ashburton District',
      'Timaru District',
      'Mackenzie District',
      'Waimate District',
      'Waitaki District'
    ]
  },
  {
    name: 'Otago',
    containedTerritories: [
      'Central Otago District',
      'Queenstown-Lakes District',
      'Dunedin City',
      'Clutha District'
    ]
  },
  {
    name: 'Southland',
    containedTerritories: [
      'Southland District',
      'Gore District',
      'Invercargill City'
    ]
  },
  {
    name: 'Online', // special location, i.e. online volunteer opportunities
    containedTerritories: []
  }
]

// construct a list of territories from the regions
const territories = regions.map(r => r.containedTerritories).reduce((acc, val) => {
  return [...acc, ...val]
})

const sortedLocations = [
  ...regions.map(r => r.name),
  ...territories
  // ,...suburbs
]
sortedLocations.sort((l1, l2) => l1.localeCompare(l2))

module.exports = {
  regions,
  territories,
  sortedLocations
}
