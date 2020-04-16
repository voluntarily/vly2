const { regions, sortedLocations } = require('../../../server/api/location/locationData')
const { gra } = require('./util')

const generatedData = {
  // [key]: {
  //   i: 0+, // iteration
  //   regionLastUsed: {
  //     [region.name]: i
  //   },
  //   usedLocations: []
  // }
};

const sample = arr => arr[gra(0, arr.length - 1)];
const allRegions = regions.map(d => d.name);
const getLocation = (key) => {
  if(!generatedData[key]) {
    generatedData[key] = { i: 0, regionLastUsed: { Online: Number.POSITIVE_INFINITY }, usedLocations: ['Online'] }
  }
  const data = generatedData[key];
  let regionGap = 4;

  if(data.usedLocations.length === sortedLocations.length) {
    // if all (78) locations have been used, reset it
    generatedData[key].usedLocations = ['Online'];
  }

  let region, location;
  do {
    const blockedRegions = Object.entries(data.regionLastUsed).filter(([_, v]) => v > data.i - regionGap).map(([k,_]) => k);
    const remainingRegions = allRegions.filter(r => blockedRegions.indexOf(r) === -1);

    const allRemainingLoc = remainingRegions.map(region => [region, ...regions.find(r => r.name === region).containedTerritories]).flat().filter(r => data.usedLocations.indexOf(r) === -1);
    if(allRemainingLoc.length === 0) {
      // No available locations for remaing regions. Decrease region gap and try again
      regionGap--;
      location = undefined;
    }
    else {
      region = sample(remainingRegions);
      const territories = regions.find(r => r.name === region).containedTerritories;
      const remainingLocations = [...territories, region].filter(r => data.usedLocations.indexOf(r) === -1);

      if(remainingLocations.length === 0) {
        location = undefined;
      } else {
        location = sample(remainingLocations);
      }
    }
  } while (location === undefined);

  data.regionLastUsed[region] = data.i;
  data.i++;
  data.usedLocations.push(location);
  return location;
};

module.exports = {
  getLocation,
}
