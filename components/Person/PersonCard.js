import React from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import {
  MailOutlined,
  PhoneOutlined,
  HomeOutlined
} from '@ant-design/icons'

import { StreetAddressLinkLi } from '../Address/StreetAddress'

const PersonContainer = styled.section`
height: auto;

img {
  max-height: 8rem;
  max-width: 8rem;
  object-fit: cover;
  width: 100%;
  height: 100%;
  border-radius: 8px;
}


figcaption {
  display: grid;
  grid-template-columns: 8rem 1fr;
  gap: 2rem;
  margin-bottom: 1rem;


@media screen and (max-width: 1000px) {
    grid-template-columns: 1fr;

  }

@media screen and (max-width: 720px) {
  img {
  max-height: 4rem;
  max-width: 4rem;
  
  }
}

  /* box-shadow: 1px 1px 12px 2px rgba(10,10,10,0.2);
  border-radius: 8px; */
}

a {
  align-self: center;
}

a:hover {
  h4, p {
    color: #6549AA;
  }

}
`
const PersonCard = ({ person }) => (
  <PersonContainer>

    <figcaption>
      {/* eslint-disable-next-line */}
      <img alt='persons avatar' src={person.imgUrl} /> 
      <Link href={`/people/${person._id}`}>
        <a target='_blank'>
          <h4>{person.name}</h4>
          <p>{person.placeOfWork}</p>
          <p>{person.job}</p>
        </a>
      </Link>
    </figcaption>

    <section>
      <h5>Contact details</h5>
      <p className='personName'><MailOutlined /> {person.email}</p>

      {person.phone &&

        <p className='personName'><PhoneOutlined /> {person.phone}</p>}

      {person.phone && person.address && person.address.addressSummary &&

        <p className='personName'><HomeOutlined /> <StreetAddressLinkLi address={person.address.addressSummary} /></p>}
    </section>

    <style jsx>{`
      .personName {
     
        margin-bottom: 0.5rem;
        overflow: hidden;
        text-overflow: ellipsis; 
        word-wrap: break-word;
        display: inline;
        display: -webkit-box;
        -webkit-line-clamp: 6;
        -webkit-box-orient: vertical;
      }
    `}
    </style>
  </PersonContainer>
)

export default PersonCard
