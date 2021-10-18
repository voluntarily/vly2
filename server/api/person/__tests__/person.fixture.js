const people = [
  {
    name: 'Andrew Watkins',
    nickname: 'avowkind',
    email: 'andrew@groat.nz',
    about: `
Voluntarily.NZ Product Lead
30+ years in software development, product management, systems design and team leadership across a range of industries including science, technology, engineering, health, automotive, transport, mobile phone, and travel. I have a strong balance of technical and management skills.

I have run my own company and led a start-up mobile phone company software team through a high growth period. I have created and developed multiple agile cross functional teams, managed DevOps processes and modernised IT platforms including migration to cloud services.

I have a track record as a forward-thinking, customer focussed, innovative solutions designer and product development manager taking ideas from conception through implementation and delivery and into operation through a full business-process-aligned life cycle, managing teams using agile methodologies, leading-edge tools and technologies. 
`,
    locations: ['Auckland'],
    pronoun: {
      subject: 'he',
      object: 'him',
      possessive: 'his'
    },
    language: 'EN',
    role: [
      'admin'
    ],
    status: 'active',
    imgUrl: 'https://avatars2.githubusercontent.com/u/1596437?v=4',
    phone: '+64 027 7031007',
    sendEmailNotifications: true,
    website: 'https://voluntarily.nz',
    tags: ['javascript', 'programming', 'software', 'python', 'c++'],
    topicGroups: ['business']
  },
  {
    nickname: 'Dali',
    about: "Salvador Domingo Felipe Jacinto Dalí i Domènech, 1st Marquis of Dalí de Púbol (11 May 1904 – 23 January 1989), known professionally as Salvador Dalí (/ˈdɑːli, dɑːˈli/;[1][2] Catalan: [səlβəˈðo ðəˈli]; Spanish: [salβaˈðoɾ ðaˈli]), was a prominent Spanish surrealist born in Figueres, Catalonia, Spain.\n\nDalí was a skilled draftsman, best known for the striking and bizarre images in his surrealist work. His painterly skills are often attributed to the influence of Renaissance masters.[3][4] His best-known work, The Persistence of Memory, was completed in August 1931. Dalí's expansive artistic repertoire included film, sculpture, and photography, at times in collaboration with a range of artists in a variety of media.\n\nDalí attributed his \"love of everything that is gilded and excessive, my passion for luxury and my love of oriental clothes\"[5] to an \"Arab lineage\", claiming that his ancestors were descendants of the Moors.[6][7]\n\nDalí was highly imaginative, and also enjoyed indulging in unusual and grandiose behavior. To the dismay of those who held his work in high regard, and to the irritation of his critics, his eccentric manner and attention-grabbing public actions sometimes drew more attention than his artwork.[8][6]",
    locations: ['Christchurch'],
    pronoun: {
      subject: 'he',
      object: 'him',
      possessive: 'his'
    },
    language: 'EN',
    role: [
      'volunteer',
      'activityProvider'
    ],
    status: 'active',
    name: 'Salvador Domingo Felipe Jacinto Dalí i Domènech, 1st Marquis of Dalí de Púbol ',
    email: 'salvador@voluntarily.nz',
    phone: '000 000 0000',
    sendEmailNotifications: true,
    imgUrl: 'https://uploads5.wikiart.org/images/salvador-dali.jpg!Portrait.jpg',
    tags: [],
    topicGroups: []

  },
  {
    name: 'Alice Niceteacher',
    nickname: 'niceteacheralice',
    about: 'Alice is a registered primary school teacher, working in Napier who has filled in her teacher details',
    locations: ['Napier'],
    email: 'atesty@voluntarily.nz',
    phone: '027 444 5558',
    sendEmailNotifications: true,
    pronoun: {
      subject: 'she',
      object: 'her',
      possessive: 'her'
    },
    imgUrl: 'https://publicdomainvectors.org/photos/teacher.png',
    role: ['opportunityProvider', 'basic'],
    status: 'active',
    tags: [],
    topicGroups: ['education'],
    teacher: {
      registration: {
        trn: '123456',
        firstname: 'Alice Mary Jane',
        lastname: 'Niceteacher',
        category: 'Full',
        expiry: '24 Dec 2025'
      }
    }
  },
  {
    name: 'Testy B McTestface',
    nickname: 'B Testy',
    about: 'SUPPORT',
    locations: ['Waikato'],
    email: 'btesty@voluntarily.nz',
    phone: '027 444 5557',
    sendEmailNotifications: true,
    pronoun: {
      subject: 'they',
      object: 'them',
      possessive: 'their'
    },
    imgUrl: 'https://blogcdn1.secureserver.net/wp-content/uploads/2014/06/create-a-gravatar-beard.png',
    role: ['support', 'volunteer'],
    status: 'active',
    tags: [],
    topicGroups: []

  },
  {
    name: 'Testy C McTestface',
    nickname: 'C Testy',
    about: 'SUPPORT',
    locations: ['Waikato District'],
    email: 'ctesty@voluntarily.nz',
    phone: '027 444 5556',
    sendEmailNotifications: true,
    pronoun: { subject: 'they', object: 'them', possesive: 'ȁǹy' },
    imgUrl: 'https://blogcdn1.secureserver.net/wp-content/uploads/2014/06/create-a-gravatar-beard.png',
    role: ['volunteer'],
    status: 'active',
    tags: [],
    topicGroups: []

  },
  {
    name: 'Testy D McTestface',
    nickname: 'D Testy',
    about: 'SUPPORT',
    locations: ['Opotiki District'],
    email: 'dtesty@voluntarily.nz',
    phone: '027 444 5555',
    sendEmailNotifications: true,
    imgUrl: 'https://blogcdn1.secureserver.net/wp-content/uploads/2014/06/create-a-gravatar-beard.png',
    role: ['volunteer'],
    status: 'active',
    tags: [],
    topicGroups: []

  },
  {
    name: 'Testy E McTestface',
    nickname: 'E Testy',
    about: 'SUPPORT',
    locations: ['South Taranaki District'],
    email: 'etesty@voluntarily.nz',
    phone: '027 444 5554',
    sendEmailNotifications: true,
    imgUrl: 'https://blogcdn1.secureserver.net/wp-content/uploads/2014/06/create-a-gravatar-beard.png',
    role: ['volunteer'],
    status: 'active',
    tags: [],
    topicGroups: []

  },
  {
    name: 'Testy F McTestface',
    nickname: 'F Testy',
    about: 'SUPPORT',
    locations: ['Wellington'],
    email: 'ftesty@voluntarily.nz',
    phone: '027 444 5553',
    sendEmailNotifications: true,
    imgUrl: 'https://blogcdn1.secureserver.net/wp-content/uploads/2014/06/create-a-gravatar-beard.png',
    role: ['support', 'volunteer'],
    status: 'active',
    tags: [],
    topicGroups: []

  }
]

module.exports = people
