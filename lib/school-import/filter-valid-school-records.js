const emailDomainAllowList = [
  '.school.nz',
  '.ac.nz',
  'saintkentigern.com',
  'acgedu.com',
  'pen.net.nz',
  'lyttonhigh.net',
  'flaxcol.co.nz',
  'orewacollege.nz',
  'taumarunuihighschool.co.nz',
  'hawk.hohepa.org.nz',
  'ohaeawaiprimary.co.nz',
  'waicol.co.nz',
  'sjr.nz',
  'matcol.nz',
  'kaingaroa.co.nz',
  'tuakaucollege.com',
  'up.education',
  'sspx.com',
  'akospace.com',
  'christscollege.com',
  'stpaulscollege.co.nz',
  'kurakokiri.maori.nz',
  'gisboyshigh.net',
  'goldenbeads.org.nz',
  'merakimontessori.co.nz',
  'taiwananga.co.nz',
  'pcschool.co.nz',
  'kaurihohoreschool.co.nz',
  'silverstre.am',
  'tautoroschool.co.nz',
  'kurahokianga.co.nz',
  'reap.org.nz',
  'amburyparkcentre.org.nz',
  'ps.gen.nz',
  'sspx.org.nz',
  'whangaroakkm.co.nz',
  'nz.oneschoolglobal.com',
  'saintmichaels.co.nz',
  'kawakawaprimary.co.nz',
  'dunedinsteiner.nz',
  'sps.kiwi.nz',
  'stpatta.co.nz',
  'kura.org.nz',
  'kaitokeschool.com',
  'kokohuia.co.nz',
  'airnet.net.nz',
  'waverleyprimary.co.nz',
  'fairhaven.net.nz',
  'cobhamschool.nz',
  'upokongaro.net',
  'spotswoodprimary.co.nz',
  'cambridgeprimary.co.nz',
  'maungarakischool.net',
  'hampsteadschool.co.nz',
  'upperhuttschool.nz',
  'mayfieldschool.co.nz',
  'mairehau.net',
  'stannes.co.nz',
  'rosebankschool.co.nz',
  'tauhei.co.nz',
  'karitaneschool.co.nz',
  'parkside.net.nz',
  'deafeducation.nz',
  'halswellcollege.com',
  'waldorftga.nz',
  'hvschool.co.nz',
  'clevedonschool.co.nz',
  'coatesvilleschool.nz',
  'maristschool.co.nz',
  'mtrichmondschool.co.nz',
  'okiwischool.co.nz',
  'taupointermediate.co.nz',
  'rosehill.org.nz',
  'taurangaspecialschool.nz',
  'greenparkschool.co.nz',
  'sunnynookschool.nz',
  'hilltop.org.nz',
  'pukeatuaschool.co.nz',
  'rotorua-intermediate.org.nz',
  'waerengaschool.co.nz',
  'farmside.co.nz',
  'hastingsgirls.com'
]

const hasAllowedDomain = (emailDomain) => {
  for (const allowedEmailDomain of emailDomainAllowList) {
    if (emailDomain.endsWith(allowedEmailDomain)) {
      return true
    }
  }

  return false
}

const filterValidSchoolRecords = (unfilteredSchoolRecords) => {
  return unfilteredSchoolRecords
    .filter(school => school.emailDomain !== '')
    .filter(school => hasAllowedDomain(school.emailDomain))
}

module.exports = filterValidSchoolRecords
