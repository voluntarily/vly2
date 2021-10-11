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

* all uses of Helmet replaced with Head provided by Next/head.


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

* OrgListPage  OrgListPage
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
    * this did not work properly before the current org would not be shown and the id would instead. Updated so that we correctly pass in and out an org structure as value but display in the selector the { value, label } required.

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
    * switch from withMockRouter to useMockRouter

* PersonListPage
    * people response not json serialisable. due to invalid json decoding on person.controller.  change to string decode for select and search.  This clearly has not been tested much. Ditto Organisation.controller.
    * only get data required for person list item - much shorter than fetching all people.

    * page is now sorted by name instead of nickname

## Activity

### Act Components

* ActAboutPanel.js - passed
* ActCard.js - passed
* ActList.js - passed
* ActOpsPanel.js - no test
* ActSearchInput.js - no test
* ActUnknown.js - correct spelling, change test for MemoizedFormattedMessage
* ActAdd.js - passed
* ActCardSuggest.js - passed
* ActListSection.js
    * warnings on warnKey and eventKey from antd
    * test needs await for onClick response.
* ActReadMore.js - passed
* ActTabs.js
    * use ActiveKey
    * use Antd card style
* ActBanner.js - passed
* ActDetailForm.js - passed with some class name changes 
    * TODO: convert to antd 4 form 
* ActMenu.js - no test, covered by others
* ActResourcesPanel.js - no test
* ActTryBelow.js - update to memoized formatted message
* all component tests - passing - 28 tests

### Act Pages

* ActDetailPage
    * replace ActDetailPage.getInitialProps with GetServerSideProps
    * fix the tab effect.
    * bug - about only shows if there is a description. but edit defaults to about tab.

* ActListPage - passed

## Ops

### Op Components

* ActiveOpsSection.js
* ArchivedInterestedOpsSection.js
* ArchivedOpsSection.js
* DatePickerType.constant.js
* InterestedOpsSection.js
* OpAboutPanel.js
* OpAdd.js - passed
* OpAddCard.js - passed
* OpArchivedHeader.js - passed
* OpAskFormLong.js
* OpBanner.js - passed
* OpCard.js - passed
* OpChatPanel.js - no test
* OpCloseOpportunity.js
    * test changes to MemoizedFormattedMessage
* OpEvent.js - no test
* OpFeedback.js - no test
* OpFormDate.js - subform
    * remove seconds from the display and the picker
    * 
* OpFormDescription.js - subform
* OpFormDoneBtns.js - subform
    * pass in all props so that the button can trigger submit
    * fix save draft or publish options.
* OpFormImg.js - subform
* OpFormLocation.js - subform
    * Factored out AddressLookup component
* OpFormOrg.js - subform
    * fixed OrgSelector. - did not show org name correctly.
* OpFormTags.js - subform
* OpFormTitle.js - subform
* OpList.js - passed
* OpListSection.js - passed
    * Convert from class to function
    * 
* OpListSmall.js
* OpManagePanel.js
    * test changes to MemoizedFormattedMessage
* OpMessage.js
* OpOfferFormLong.js
* OpOrderby.js
    * Select changes to ForwardRef(InternalSelect) in test
* OpQuestionPanel.js
* OpRecommendations.js - passed
* OpShareLinks.js - passed
* OpShortForm.js - passed
    * full rewrite to AntD 4 style
    * unpack some structures like duration and start/end date into fields for easier component usage, repack on finish.
    * set publish and draft working - but short form hides the draft option.
    * set correct rule and message for required description field
    * scroll to first error on done. 
    * updated to latest sinon so we can use promises in tests.
    * completed tests
* OpStatus.js - passed
* OpTabs.js
    * update to use activeKey
* OpType.js - passed
* OpUnknown.js - no test
* OpUpdatePanel.js - no test
* OpVolunteerInterestSection.js - no test
* RecommendedOpsSection.js - no test

### Op Pages

* OpListPage - passed
    * roles does not seem to be used,  in fact this page is rarely used except to view all ops. 

* OpDetailPage
    * tests updated to new gssp object
    * factor out useMockRoute

## VTheme Components

* Html - passed
* IdLine - passed
* ItemList - test modified to deal with &nbsp; after icon.
* NumericRange - passed
* VTabs - passed

## Statistics Components

* StatisticsRatingsReport - passed
* StatisticsLocationsReport - passed
* StatisticsPanel - passed
* StatisticsSummaryReport - passed
* StatisticsActivityTagsReport - passed
* StatisticsTimeframeSelector - passed
* OrgStatisticsTabs - passed

## Home Components

* HomeBanner - passed
* HomeTabs - passed

## Footer Components

* WomensRefuge - passed

## Interest Components

* RegisterInterestSection - passed
    * switch to use makeStoreTest for equivalent to old functionality.
* RegisterInterestItem - passed
    * mountWithIntl problem throwing exception when sendBtn clicked on invite due to popup not carrying over the intl provider. to fix in test formattedMessage react components need to be replaced with formatMessage function calls, this is more efficient as they can be statically compiled.
* InterestSection - passed
* InterestItem - passed
* Interest.fixture - passed
* InterestConfirmation - passed
    * fix test for changed icon 
* InterestTable - passed
* RegisterInterestMessageForm - passed
* InterestArchivedSection - passed
* InterestArchivedTable

## NoResult Component

* NoResult
    * Formatted message here is not memoized

## Form Components

* TypeOpSelector - passed
* LocationSelector - passed
* EducationSelector - passed
* RichTextEditor - passed
* TagInput - passed
* FileUpload - passed

## Teacher Components

* TeacherRegistrationRecord - passed
* GetTeacherRegistration - passed

## SignUp Components

* AboutYou - passed
* AllDone - passed
* SignUpStyles - passed
* AcceptPrivacy - passed with warning
    * Need to enable import of .md files. check the MDX stuff. 
    * had error in order of loading wrappers in next.config.js
    * this works ok iRL failing in test as test doesn't have a md loader.
    * This test passed previously but produced a warning. it was not really loading the test md file 
    * workaround is to exclude md files in setup-test-env.js resulting in the warning. 
* SelectTopicGroup - passed
* ChooseParticipation - passed

## Member Components

* MemberItem - passed
* MemberExport - passed
* MemberSectionInfo - passed
* MemberTable
    * table row has extra button so test changes to find inviteButton
    * replace withMockRoute with useMockRoute
* MemberUl - passed
* MemberSection
    * table row has extra button so test changes to find 
* RegisterMemberSection - passed
* InviteMembers - passed 
    * but had to convert to mount from shallow as 
* RegisterMemberItem - passed
    * change from class to form
* quiz - passed

## Redux example tests

* MockReduxStoreTest - passed
* LocalStateTest - passed
* ReduxAsyncTest - passed
* RealReduxStoreTest - passed

## Search/ Tag Components

* TagDisplay - passed
* TypeFilter - passed
    * uses local styles .less file.  replace css style file. 
* FilterContainer - no test
* HeaderSearch - no test
* LocationFilter - no test

## Navigation Components

* Footer - passed
* Navigation - passed
* Header

## examples components

* IntlDemo - passed
* UseRouter - passed
* AntdType - passed
* Uploader - passed
* LessStyled - failed
    * removed - don't use less local styles
    * removed styles.less theme.less
* Hello - passed

## DynamicFieldSet Components  (used in Act Detail Form)

* DynamicFieldSet - passed

## Landing Page Components

* rename Landing to Landing for consistency
* FeaturedTwoSection - passed
    * removed prop types - warnings don't keep up with usage
* Hero2 - passed
* Partners - passed

## Story

We have this whole posting and comment system called story that Farjana wrote that is partially completed
it doesn't have an entry page but you can see the current status on /test/test-edit

* AddStory - passed

## Warnings

* Unverified - passed

## Goals

* GoalSection - passed
* GoalList - passed
* GoalCard - passed
    * fix changes to icon naming
* PersonalGoalSection - passed
* GoalGroupHeading


## PostSignUp pages

* flow/postSignUp - no test
* 