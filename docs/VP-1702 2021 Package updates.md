# VP-1702 Package updates Sept 2021

Goal - bring the Voluntarily code base up to latest versions of the major packages in use.
Ensure we have all necessary security patches, and remain on Long term support (LTS) versions of the framework and tools.

Remove any package warnings and use of deprecated features.
Remove any redundant packages.

## Major updates

### Node - 14 -> 16

Updated Dockerfile

docker compose - 3.4 -> 3.9
React -16.12.0 -> 17. #
NextJS 9 -> 11

# Actions

* checkout and build, run tests - 1 failure, not reproducible
* build and run up the local docker compose files.
* commit and check build runs on github.

* bunch of time spent getting mongoose-crudify to work, code base on git keeps switching to ssh access which doesn't work.  Forked to @voluntarily/mongoose-crudify

*

# Changes

## remove next-less, next-css etc

These are deprecated and replaced with internal next css capability.  However we still need less in order to create our custom Antd theme. - perhaps we can build our own antd css independently.

## AntD -> 4

### Icons

Icons used to have a single <Icon> component with a type selector - this brings all the icons into the build.
Antd has a separate component for each Icon so <Icon type='home' > -> <HomeFilled />  each one used must be imported.
Icons were used in a large number of places. ## Next-routes -> next-routes-extended
This library has been abandoned and does not work with Next 11/ react 17.  However someone forked it into
next-routes-extended so we will use that for now.
In future we should be able to replace all these routes with NextJS dynamic routing.

## React-intl -> 5.20.10

this may involve some changes to how we do internationalisation

## React-quill "react-quill": "2.0.0-beta.4"

This is the rich text editor used for forms.
This major update is still in beta but is the only version working with React 17. Go along with it for now and update when its officially released.

## "recharts": "^2.1.4"

Recharts is a Redefined chart library built with React and D3.
used for charts in the ratings and statistics pages.

## anon default components

Anonymous arrow functions cause Fast Refresh to not preserve local component state.
we need to name the functions

        Before
        export default () => <div />;

        After
        const Named = () => <div />;
        export default Named;

Fixed these using npx @next/codemod name-default-component. 12 files affected.

## react-helmet

* all uses of <Helmet> replaced with <Head> provided by Next/head.


## AntD Styles fix

changes to how css is imported and less is out by default. fix by including a new package

## AntD Form updates

Person/PersonDetailForm.js

# Test failures

- server › api › interest › interest.ability › Interest API - anon - list
    * not repeatable.

# Page checking

## Home

* fix tab update with useEffect

* HomeTabs
    * drop VTabs styles, use large ant cards.
    * add useEffect so url is set on tab click

* SignUp preferences on profile tab
    * updated hydration of the 'me' object in redux means this is not attached to a model. So we can't just modify and save it. instead we use the id to get a fresh object from the db which is saved. This is safer anyway. 
## Organisation

* OrgListPage  OrgListPage.spec.js
* OrgDetailPage
* OrgDetailForm - passing but lots of warnings, Form needs to be modernised.
*
* OrgBanner
* OrgCard
* OrgRole
* OrgAboutPanel
* OrgHistoryPanel
    * get makeStore to use new store.js
    * some match span changed to div in antd.
* OrgOfferedActivities
* OrgSelector

## Person

* PersonBadge - passed
* PersonCard - useLayoutEffect warning
* PersonDetail - using useMockRouter - mock not passed down to verification so leave as is.
* PersonDetailForm
    * added back the address location widget - using useEffect
    * when person is updated the session.me is not so the detail page is out of sync.
    * locations list is updated from address every save duplicating locations.
    * TODO - convert to Antd 4 form
* PersonList - passed
* PersonListItem - passed
* all person components - passed

* PersonDetailPage
    * get server side props, factor out a version we can test using mock store.
    * switch from withMockRouter to mockUseRouter

* PersonListPage
    * people response not json serialisable. due to invalid json decoding on person.controller.  change to string decode for select and search.  This clearly has not been tested much. Ditto Organisation.controller.
    * only get data required for person list item - much shorter than fetching all people.

    * page is now sorted by name instead of nickname

## Activity
