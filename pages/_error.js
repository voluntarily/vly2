/**
 * Creating a page named _error.js lets you override HTTP error messages
 */
import React from 'react'
import Head from 'next/head'
import { FormattedMessage, useIntl, defineMessages } from 'react-intl'
import { FullPage, Spacer } from '../components/VTheme/VTheme'
import styled from 'styled-components'

const BugImage = styled.img`
   width: 5rem;
   height: 5rem;
   position: relative;
   animation: rotation 2s infinite linear;
   float: left;
 
   @keyframes rotation {
     50% {
       transform: rotate(20deg);
     }
     100% {
       transform: rotate(0deg);
     }
   }
 `

const BugContainer = styled.div`
   margin-top: 1.5rem;
   margin-left: 3rem;
 `

const ErrorPage = ({ url, locale, errorCode, initialNow }) => {
  const intl = useIntl()
  const messages = defineMessages({
    title: {
      id: 'error.pagenotfound.title',
      description: 'Page title for the 404 error',
      defaultMessage: 'Oh no! Page not found'
    }
  })

  switch (errorCode) {
    case 200: // Also display a 404 if someone requests /_error explicitly
    case 404:
      return (
        <FullPage>
          <Head>
            <title>{intl.formatMessage(messages.title)}</title>
          </Head>
          <Spacer />
          <Spacer />
          <div>
            <FormattedMessage
              id='error.pagenotfound.title'
              description='Page title for the 404 error'
              defaultMessage='Oh no! Page not found'
              tagName='h1'
            />

            <FormattedMessage
              id='error.pagenotfound.description'
              defaultMessage="The page you are looking for is not here. We have looked everywhere but it doesn't seem to exist. Perhaps it just hasn't been built yet."
            />
                 &nbsp;
            <a href='https://voluntarily.nz/get-involved'>
              <FormattedMessage
                id='error.pagenotfound.contribute'
                defaultMessage='If you can write code you can help fix that by becoming a contributor to the project.'
              />
            </a>
                 &nbsp;
          </div>
          <Spacer />
          <BugImage src='/static/img/bug.png' />
          <BugContainer>
            <p>
                     An <strong>HTTP {errorCode}</strong> error occurred
                     while trying to access{' '}
              <strong>{url}</strong>
            </p>
          </BugContainer>
        </FullPage>
      )
    default:
      return (
        <FullPage>
          <Head>
            <FormattedMessage
              id='error.servererror.title'
              description='Page title for error pages'
              defaultMessage='There was a problem'
              tagName='title'
            />
          </Head>
          <Spacer />
          <Spacer />
          <div>
            <FormattedMessage
              id='error.servererror.description'
              description='A server error'
              defaultMessage='Sorry, there was a problem and we can not complete this task. We have let our team know so they can take a look and fix it. For now try to refresh the page, or go back to the previous page'
              tagName='h2'
            />
            <h4 className='display-4'>HTTP {errorCode} Error</h4>
            <p>
                     An <strong>HTTP {errorCode}</strong> error occurred
                     while trying to access{' '}
              <strong>{url}</strong>
            </p>
                 &nbsp;
          </div>
        </FullPage>
      )
  }
}
ErrorPage.getInitialProps = ({ res, xhr, req }) => {
  const errorCode = res ? res.statusCode : xhr ? xhr.status : null

  return {
    errorCode,
    url: req.url
  }
}
export const ErrorPageTest = ErrorPage // for test

export default ErrorPage
