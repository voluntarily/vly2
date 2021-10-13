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

## Page routes

Move from using the routes.js file to the page tree dynamic routes preferred by NextJs.
e.g rename personDetailPage.js to [personId].js 

## Higher Order Components PublicPage, AdminPage, SecurePage Removed

All the page level HOCs have been removed. These were used to wrap pages in layers of

* layout - publicpage
* security - securepage
* admin access - adminpage

However these HOCs dont know whether to call GetServerSideProps or GetInitialProps etc. 

So now we do the following:

1. layout - all pages use the default layout injected by _App.  If you need a page without header/footer you can use the next js method override layout. 
2. secure pages by default all pages are secured in _app using the RouteGuard Component. if not signed in you are redirected to the signthru steps. For specific public pages these are listed public paths now need to be explicitly added to the publicPaths array in routeguard.js
3. Admin pages are no longer special - they just check the isAdmin prop on start and return the AccessDenied component if not an admin. 


## Home

* fix tab update with useEffect

* HomeTabs
    * drop VTabs styles, use large ant cards.
    * add useEffect so url is set on tab click

* SignUp preferences on profile tab
    * updated hydration of the 'me' object in redux means this is not attached to a model. So we can't just modify and save it. instead we use the id to get a fresh object from the db which is saved. This is safer anyway. 

* redux hydration problems
    * using link to switch between pages causes older data in redux to be discarded and GSSP is not re-run 

Home page is created gssr runs and a session is included along with any data required for home page. Link to Orgs page causes new gssr page load. this sets the organisations data. 
On link back to home page the hydration should restore the original home page state. or preserve the combined states.

The two hydrations arise from the App.GIP which is setting the session and the page GSSP which is setting the local data.
when we return to home we seem to miss out on the session - which results in no signed in user.

We see AppGIP undefined on a link transition. so is get session failing?
it is being set to a default session in the server middleware. 

looks like special path handling which is intended to bypass session loading for paths to _next is needed when we are getting the data/page.json file used to hydrate the redux object.  commenting this out fixes the linked page problem

* __tests__/home.spec.js
    * handling tabs is tricky in tests they don't easily respond to clicks and the panel updates are async
    * so we instead set the query parameter for tab and load the page separately for each panel.
    * for some time only one test in the suite was being run so others had got out of date.
    * not testing the saving of the edited profile - but this is covered elsewhere
## Organisation

### Org Pages

* OrgListPage - passed
    * factor out gssp test as it no longer returns props
    * feed the OrgDetailPage with organisation prop.
* OrgDetailPage - passed
    * test rework to useMockRouter, set edit page etc. 
    * should split edit and other tests into two files.
* OrgDetailForm - passing but lots of warnings, 
    * Form needs to be modernised.

### Org Components

* OrgBanner - passed
* OrgCard - passed
* OrgRole - passed
* OrgAboutPanel - passed
* OrgHistoryPanel - passed
    * get makeStore to use new store.js
    * some match span changed to div in antd.
* OrgOfferedActivities - passed
* OrgSelector - passed
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
* __tests__/person/persondetailpage.spec.js - passed

* PersonListPage - no test
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

* ActDetailPage - passed
    * replace ActDetailPage.getInitialProps with GetServerSideProps
    * fix the tab effect.
    * bug - about only shows if there is a description. but edit defaults to about tab.
    * adjust test to call gssp in acts/new

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
    * test updated for new path

* OpDetailPage - passed
    * tests updated to new gssp object
    * factor out useMockRoute

* ArchivedOpDetailPage - passed
    * __tests__/archivedop/archivedopdetailpage.spec.js
    * updated for gssp and dynamic pages
## VTheme Components

* Html - passed
* IdLine - passed
* ItemList - test modified to deal with &nbsp; after icon.
* NumericRange - passed
* VTabs - passed

## Statistics 
### Statistics Components

* StatisticsRatingsReport - passed
* StatisticsLocationsReport - passed
* StatisticsPanel - passed
* StatisticsSummaryReport - passed
* StatisticsActivityTagsReport - passed
* StatisticsTimeframeSelector - passed
* OrgStatisticsTabs - passed

### Statistics Pages
__tests__/statistics/orgstatisticspage.spec.js - passed


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
* FileUpload - returns hook error
    * version of UUID has changed as v4 is now in main uuid package. adopt new way of loading

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
  
__tests__/story/storydetailpage.spec.js - passed
__tests__/story/storylistpage.spec.js - passed

## Warnings

* Unverified - passed

## Goals

* GoalSection - passed
* GoalList - passed
* GoalCard - passed
    * fix changes to icon naming
* PersonalGoalSection - passed
* GoalGroupHeading - passed

* __tests__/goal/school/ready.spec.js - passed
    * get server side props updated

## PostSignUp pages

* flow/postSignUp - no test



2021-10-12
  191 tests failed
  9 tests skipped
  1 unhandled rejection
  11 uncaught exceptions



### Miscellaneous Pages

* __tests__/404.spec.js - passed
* __tests__/feedback/feedbacksubmitpage.spec.js - passed
    * add useMockRouter
* __tests__/landing.spec.js - passed
* __tests__/action/registerTeacher/registerTeacher.spec.js - passed
* __tests__/terms.spec.js - passed
    * test passing but the .md file import is bypassed in test because the required babel loader is overridden
    * this means we get back a null object which causes a warning in the test output
    * TODO: fix loading md files in tests.

### API pages
* __tests__/api/notify/org/action.spec.js - passed
* __tests__/api/notify/org/notifyOrg.spec.js
* __tests__/api/registerRequestor/registerRequestor.spec.js - passed
* __tests__/api/health/health.spec.js - passed
    * renamed [param] to [healthQuery] to avoid difficult to identify filenames.
* __tests__/api/reports/summary.spec.js - passed
* __tests__/about.spec.js - passed
* __tests__/reports/summary.spec.js  
    * SKIPPED until isAdmin can be stubbed without Redux
__tests__/admin/admin.spec.js
    * lots to fix up here.  These were loading the full server and api handler in order to verify access control
    * now we just need to test the page component as usual, passing in the correct props or redux store. 
    * still to do the school setup page - but low priority. 

## Library files

* lib/redux/__tests__/redux.spec.js - passed
    * SetSession has to convert the me to a form that can be serialised by the redux hydration. 
        this doesn't handle null, undefined, dates and object id types. which all need to become strings.
        so we convert to json and back again. this is not ideal but ok.

* lib/auth/__tests__/auth.spec.js - passed
* lib/sec/__tests__/keys.spec.js - passed
* lib/sec/__tests__/actiontoken.spec.js - passed
    * t.throws changed signature - now needs an expectation value
* lib/school-import/__tests__/import.spec.js - passed
* lib/school-import/__tests__/filter-valid-school-records.spec.js - passed
* lib/school-import/__tests__/map-import-data-to-schema.spec.js - passed
* lib/school-import/__tests__/get-domain-from-email.spec.js - passed
* lib/__tests__/urlUtil.spec.js - passed
* lib/__tests__/callApi.spec.js - passed
    * 3 failed t.throwsAsync call format
* lib/__tests__/durationUtil.spec.js - passed

# Server 

## Middleware

* server/middleware/authorize/__tests__/authorizeRequest.spec.js
    * change to @casl/ability AbilityBuilder  casl moved from 3.4 to 5.4 
    * defineAbility replaces AbilityBuilder.define but see new docs here https://casl.js.org/v5/en/guide/define-rules
* server/middleware/ability/__tests__/getAbility.spec.js - passed
* server/middleware/session/__tests__/jwtVerify.spec.js - passed
* server/middleware/session/__tests__/setSession.spec.js - passed


* server/util/__tests__/initTags.spec.js - passed
* server/api/statistics/__tests__/statistics.spec.js - passed

## Opportunity API

Note these tests start the full server and mongo db so are slow to run.

* server/api/opportunity/__tests__/recommendedOps.spec.js - passed
* server/api/opportunity/__tests__/opportunity.util.spec.js - passed
* server/api/opportunity/__tests__/opportunity.spec.js - passed
* server/api/opportunity/__tests__/econreset.spec.js - passed
* server/api/opportunity/__tests__/opportunity.ability.spec.js
    generally replace import uuid from 'uuid' with import { v4 as uuid } from 'uuid'

## Interest API

* server/api/interest/__tests__/interest.messages.spec.js - passed
* server/api/interest/__tests__/interest.ability.spec.js - passed
* server/api/interest/__tests__/interest.lib.spec.js - passed
* server/api/interest/__tests__/interestArchive.spec.js - passed
* server/api/interest/__tests__/interestArchive.ability.spec.js - passed
* server/api/interest/__tests__/interest.spec.js - passed

## ArchivedOpportunity API

* server/api/archivedOpportunity/__tests__/archivedOpportunity.ability.spec.js - passed
* server/api/archivedOpportunity/__tests__/archivedOpportunity.controller.spec.js - passed

## Person API

* server/api/person/__tests__/personController.spec.js - passed
* server/api/person/__tests__/person.spec.js - passed
* server/api/person/__tests__/person.email.spec.js - passed
* server/api/person/__tests__/person.subscribe.spec.js - passed
* server/api/person/__tests__/person.lib.spec.js - passed
* server/api/person/__tests__/person.ability.spec.js - passed

## Activity API

* server/api/activity/__tests__/activity.lib.spec.js - passed
* server/api/activity/__tests__/activity.ability.spec.js - passed
* server/api/activity/__tests__/activity.spec.js - passed

## Location API

* server/api/location/__tests__/location.spec.js - passed

## Sign Up API

* server/api/signUp/__tests__/signUp.controller.spec.js - passed

## PersonalGoal API

* server/api/personalGoal/__tests__/personalGoal.spec.js - passed
* server/api/personalGoal/__tests__/personalGoal.subscribe.spec.js - passed
* server/api/personalGoal/__tests__/personalGoal.ability.spec.js - passed
* server/api/personalGoal/__tests__/GoalTests.spec.js - passed
* server/api/personalGoal/__tests__/personalGoal.lib.spec.js - passed

## Member API

* server/api/member/__tests__/member.controller.spec.js - passed
* server/api/member/__tests__/member.spec.js - passed
* server/api/member/__tests__/member.lib.spec.js - passed
* server/api/member/__tests__/findMy.spec.js - passed
* server/api/member/__tests__/member.ability.spec.js - passed

## Personal Verification API

* server/api/personalVerification/__tests__/personalVerification.controller.spec.js - passed
* server/api/personalVerification/__tests__/verified.spec.js - passed
* server/api/personalVerification/__tests__/personalVerification.helpers.spec.js - passed

## Organisation API

* server/api/organisation/__tests__/organisation.ability.spec.js 
    * ability for org admin to update their own org is failing
    * this is due to orgAdminFor containing object ids and being compared with request _id strings. perhaps this used to work. to fix replace include with some and cast in the comparison.
* server/api/organisation/__tests__/organisation.spec.js - passed
    * s and p now expects strings unquoted rather than json. 
    * bad request errors can now only be returned for q={not json}
* server/api/organisation/__tests__/organisation.lib.spec.js - passed
    * change to error message from mongodb exception

server/api/school-lookup/__tests__/school-lookup.spec.js
server/api/school-lookup/__tests__/school-lookup.ability.spec.js
server/api/tag/__tests__/tag.spec.js
server/api/tag/__tests__/tag.controller.spec.js
server/api/story/__tests__/story.ability.spec.js
server/api/story/__tests__/story.spec.js
server/api/goal/__tests__/loadGoals.spec.js
server/api/goal/__tests__/goal.ability.spec.js
server/api/goal/__tests__/goal.spec.js
server/api/badge/__tests__/badge.spec.js
server/api/badge/__tests__/badge.ability.spec.js

## Misc API
server/api/aliases/__tests__/aliases.controller.spec.js

server/api/education/__tests__/education.spec.js
server/api/image/__tests__/image.spec.js
server/api/feedback/__tests__/feedback.ability.spec.js
server/api/feedback/__tests__/feedback.spec.js

server/api/file/__tests__/file.controller.spec.js
server/api/school-invite/__tests__/school-invite.controller.spec.js

## Services

server/services/image/__tests__/imageResize.spec.js
* server/services/authorize/__tests__/removeUnauthorizedFields.spec.js - passed
    * replace AbilityBuilder.define with defineAbility for casl 5.
server/services/pubsub/__tests__/publishTopic.spec.js
server/services/email/__tests__/email.spec.js
