# VP-1702 Package updates Sept 2021

This major set of changes has the goal of bringing the Voluntarily code base up to latest versions for the major packages in use.

* Ensure we have all necessary security patche
* remain on Long term support (LTS) versions of the framework and tools.
* migrate from class to functional react
* migrate from older to new AntD forms and icons.
* Remove any package warnings and use of deprecated features.
* Remove any redundant packages.
* increase version n in package.json to 1.1.0
## Node - 14 -> 16

* Updated Dockerfile
* docker compose - 3.4 -> 3.9

## React -16.12.0 -> 17

* <https://reactjs.org/blog/2020/08/10/react-v17-rc.html#other-breaking-changes>

## NextJS 9 -> 11

* <https://nextjs.org/docs/upgrading>

### GetServerSideProps replacing GetInitialProps

The most noticable change is from general use of GetInitialProps to GetServerSideProps. GIP runs on both client and server side and triggers on page load and page transition. GSSP only runs server side. Using GSSP for all our pages ensures that the data required to populate the page has been obtained server side and sent along with the HTML and JS so that the page renders very quickly.  

There was some work required to get the use of GSSP to integrate with our use of Redux. To do this we add the `next-redux-wrapper` library and move the creation of the redux store from ReduxAPI to its own store.js file. This adds a HYDRATE action which merges the initialStore sent from the server into the client side store.  

Example:

    export const getServerSideProps = reduxWrapper.getServerSideProps(
        store => async (props) => gssp({ store, query: props.query })
    )

    // factored out for easier testing.
    export const gssp = async ({ store, query }) => {
        const select = { p: 'name imgUrl role' }
        await store.dispatch(reduxApi.actions.organisations.get(select))
        console.log('OrgListPage GSSP')
    }

Here we factor out the underying gssp function which does what the old GIP used to do and then export getServerSideProps from the page.  Note that if the page is included in another file e.g. index.js we must export both the page component and getServerSideProps for it to work.  Also note the returned props are now nested in an object `{ props: etc }`

For testing we can use gssp directly.

The one place we don't use GSSP is in _App which still has a GIP.

For pages that need to update the data after the page has loaded e.g. in response to search parameters we should now use useEffect to refresh redux or local state.

### remove next-less, next-css etc

These are deprecated and replaced with internal next css capability.  However we still need less in order to create our custom Antd theme.

### Dynamic Routes,  Next-routes removed

Move from using the routes.js file to the page tree dynamic routes preferred by NextJs.
e.g rename personDetailPage.js to [personId].js

We used this library to allow dynamic routes such as /orgs/:id when next did not allow them. Next 11 now has dynamic routes so this library is removed. Files like /orgs/orgdetailpage.js are now named /orgs/[orgId].js with the orgId being passed as a prop into the component.

### Remove Higher Order Components: PublicPage, AdminPage, SecurePage

All the page level HOCs have been removed. These were used to wrap pages in layers of:

* layout - publicpage
* security - securepage
* admin access - adminpage

However these HOCs don't know whether to call GetServerSideProps or GetInitialProps etc.

So now we do the following:

1. layout - all pages use the default layout injected by _App.  If you need a page without header/footer you can use the next js method override layout.
2. secure pages by default all pages are secured in _app using the RouteGuard Component. if not signed in you are redirected to the signthru steps. For specific public pages these are listed public paths now need to be explicitly added to the publicPaths array in routeguard.js
3. Admin pages are no longer special - they just check the isAdmin prop on start and return the AccessDenied component if not an admin.

### Remove Anonymous arrow functions

Anonymous arrow functions cause Fast Refresh to not preserve local component state.
we need to name the functions

        Before
        export default () => <div />;

        After
        const Named = () => <div />;
        export default Named;

Fixed these using npx @next/codemod name-default-component. 12 files affected.

### react-helmet no longer required

All uses of Helmet replaced with Head provided by Next/head.

## AntD Updated to Version 4

### Forms

Ant Design components have had a major version update with a significant change to the way forms are handled. - essentially moving from class to functional components.  The result is much much simpler to use.

At this time we have only updated a few of the forms as examples.  A compatability library allows the old style forms to continue working but they should be updated whenever they are changed.

* Updated Forms

    * components/Person/PersonDetailForm.js:
    * components/Member/RegisterMemberItem.js:
    * components/Op/OpFormDate.js:
    * components/Op/OpFormDescription.js:
    * components/Op/OpFormLocation.js:
    * components/Op/OpFormOrg.js:
    * components/Op/OpShortForm.js:

* Forms using @ant-design/compatible - still to do.

    * components/Act/ActDetailForm.js:
    * components/DynamicFieldSet/DynamicFieldSet.js:
    * components/Op/OpAskFormLong.js:
    * components/Op/OpFormImg.js:
    * components/Op/OpFormTags.js:
    * components/Op/OpOfferFormLong.js:
    * components/Org/OrgDetailForm.js:
    * components/Org/SchoolInviteForm.js:
    * components/Story/StoryForm.js:

### Icons

Icons used to have a single `<Icon>` component with a type selector - this brings all the icons into the build.
Antd has a separate component for each Icon so `<Icon type='home' > -> <HomeFilled />`  each one used must be imported.
Icons were used in a large number of places so there are a lot of replacements.

### Tabs

We use tabs on the main home, org, op, act and person pages. AntD has changed the way tabs work which two sets of changes:

1. When a tab is selected we update the URL with a shallow browser url replace. similarly if a URL with a tab= present is loaded we switch initially to the correct tabs.  This allows tabs to be bookmarkable and directly linkable. To do this we now need useState and useEffect to set the tab and update url on change.

        const [activeTab, setActiveTab] = useState(initTab)
        // when path changes set the active tab. as this doesn't work in updateTab
        useEffect(() => {
            const qtab = asPath.match(/.*tab=(.*)/)
            qtab && setActiveTab(qtab[1])
        }, [query])

        // when the tab changes set the active path.
        const updateTab = (key, top) => {
            if (top) window.scrollTo(0, 0)
            else { window.scrollTo(0, 400) }

            const newpath = `/orgs/${org._id}?tab=${key}`
            replace(pathname, newpath, { shallow: true })
        }

2. Testing tabs is now tricky due to the delayed effect of a tab click and because tab panels are not loaded into the DOM until needed. Rather than load the page and click on a tab it is much easier to load the page with the correct query parameter e.g. tab=edit.  To do this we use mockRouter to give control over the apparent page.
3. Because we can now set nice AntD tab styles with borders we can remove the VTab styles. This is good because tab panels must be immediate children on the tab.

## Location of static resources

Many files had links to small images in the path ./static/...  as the static folder is now in the /public folder this is automatically made available as an endpoint so the references hrefs should be /static/etc.

## Next Lint

Next linting is now turned on.  This is in addition to the standard lint which focuses on syntax checking. The next lint `npm lint:next` will check for react and next issues. e.g when hooks are not the first thing in the function and others. These should remove some more classes of errors from the system.

rules can be enabled or disabled in `.eslint.json`

TODO: - merge resolve the standard and eslint options.

### common corrections

    * Hooks in functions must not change their run order this means they must be before any code that can have a path change. 
    * '<a> anchors that href to a local page should use Link.
    * Links that don't wrap an <a> should include passHref property

## next/image Image , antd Image and img

Next recommends replacing all uses of img with next/Image and this is enforced in the next lint rules (currently turned off.  The next Image )provides checks on the image source, resizing for the client and other functions. static images including SVG images are converted to data:image which reduces the network traffic but we have to ensure that the size displayed is correct. - also breaks tests.

next/image also enforces a source domain list to protect the website.  However we allow users to upload images for display or enter urls for display. This means that we cannot allow all websites. So for those places where images are likely to be uploaded we continue to use `<img>`

AntD Image has a similar set of functions to next/image but is less strict e.g. doesn't use domain checking.
we should prefer the next/Image in future but this can be translated as we go.

## Language Processing - formatjs, React-intl -> 5.20.10

Some changes to how we do internationalisation

We use react-intl along with formatjs to generate the language strings and formatted messages. Recent updates have removed some components of the libraries as these are now supported in browsers.

The command line to create the language file has changed to formatjs extract and formatjs compile.  Replace the use of `x/default-lang` with formatjs compile.

## React-quill "react-quill": "2.0.0-beta.4"

This is the rich text editor used for forms.

This major update is still in beta but is the only version working with React 17. Go along with it for now and update when its officially released.

## Slug replaces Limax

We were using two slug libraries. update and only use slug.

## Testing

### mongodb-memory-server

In many of the server side tests we want to create, populate and work with a mongodb. The mongodb-memory-server allows us to run many parallel copies of the database each on a new port and isolated memory. Previously we wrapped this in a class that had to be created and used in each test.

This has been updated and is now simpler to use.
include mockMongo in the test file. and add test.before and after calls to the exported functions.

    import { startMongo, stopMongo } from '../../../util/useMongo'
    test.before('before connect to database', startMongo)
    test.after.always(stopMongo)

This ensures that all tests using the database are starting and stopping in the same way. Also a cleaner init removes some mongo db warnings and makes the tests quieter.

## Home Page

* fix tab update with useEffect
* HomeTabs
    * drop VTabs styles, use large ant cards.
    * add useEffect so url is set on tab click
* SignUp preferences on profile tab
    * updated hydration of the 'me' object in redux means this is not attached to a model. So we can't just modify and save it. instead we use the id to get a fresh object from the db which is saved. This is safer anyway.
* redux hydration problems
    * using link to switch between pages causes older data in redux to be discarded and GSSP is not re-run - was caused because GSSP was not being exported via the index.js page.
* /home.spec.js
    * handling tabs is tricky in tests they don't easily respond to clicks and the panel updates are async
    * so we instead set the query parameter for tab and load the page separately for each panel.
    * for some time only one test in the suite was being run so others had got out of date.
    * not testing the saving of the edited profile - but this is covered elsewhere

### Home Components

* HomeBanner - passed
* HomeTabs - passed

## Organisation

### Org Pages

* OrgListPage - passed
    * factor out gssp test as it no longer returns props
    * feed the OrgDetailPage with organisation prop.
* OrgDetailPage - passed
    * test rework to mockRouter, set edit page etc.
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
* PersonDetail - using mockRouter - mock not passed down to verification so leave as is.
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
    * switch from withMockRouter to mockRouter
* /person/persondetailpage.spec.js - passed

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
    * /archivedop/archivedopdetailpage.spec.js
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

/statistics/orgstatisticspage.spec.js - passed

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

## Redux example tests

* MockReduxStoreTest - passed
* LocalStateTest - passed
* ReduxAsyncTest - passed
* RealReduxStoreTest - passed

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
  
* /story/storydetailpage.spec.js - passed
* /story/storylistpage.spec.js - passed

## Warnings

* Unverified - passed

## Goals

* GoalSection - passed
* GoalList - passed
* GoalCard - passed
    * fix changes to icon naming
* PersonalGoalSection - passed
* GoalGroupHeading - passed

* /goal/school/ready.spec.js - passed
    * get server side props updated

## PostSignUp pages

* flow/postSignUp - no test

### Miscellaneous Pages

* /404.spec.js - passed
* /feedback/feedbacksubmitpage.spec.js - passed
    * add mockRouter
* /landing.spec.js - passed
* /action/registerTeacher/registerTeacher.spec.js - passed
* /terms.spec.js - passed
    * test passing but the .md file import is bypassed in test because the required babel loader is overridden
    * this means we get back a null object which causes a warning in the test output
    * TODO: fix loading md files in tests.

### API pages

* /api/notify/org/action.spec.js - passed
* /api/notify/org/notifyOrg.spec.js
* /api/registerRequestor/registerRequestor.spec.js - passed
* /api/health/health.spec.js - passed
    * renamed [param] to [healthQuery] to avoid difficult to identify filenames.
* /api/reports/summary.spec.js - passed
* /about.spec.js - passed
* /reports/summary.spec.js  
    * SKIPPED until isAdmin can be stubbed without Redux
* /admin/admin.spec.js
    * lots to fix up here.  These were loading the full server and api handler in order to verify access control
    * now we just need to test the page component as usual, passing in the correct props or redux store.
    * still to do the school setup page - but low priority.

## Library files

* lib/redux//redux.spec.js - passed
    * SetSession has to convert the me to a form that can be serialised by the redux hydration.
        this doesn't handle null, undefined, dates and object id types. which all need to become strings.
        so we convert to json and back again. this is not ideal but ok.

* lib/auth//auth.spec.js - passed
* lib/sec//keys.spec.js - passed
* lib/sec//actiontoken.spec.js - passed
    * t.throws changed signature - now needs an expectation value
* lib/school-import//import.spec.js - passed
* lib/school-import//filter-valid-school-records.spec.js - passed
* lib/school-import//map-import-data-to-schema.spec.js - passed
* lib/school-import//get-domain-from-email.spec.js - passed
* lib//urlUtil.spec.js - passed
* lib//callApi.spec.js - passed
    * 3 failed t.throwsAsync call format
* lib//durationUtil.spec.js - passed

## Server

### Middleware

* server/middleware/authorize//authorizeRequest.spec.js
    * change to @casl/ability AbilityBuilder  casl moved from 3.4 to 5.4
    * defineAbility replaces AbilityBuilder.define but see new docs here <https://casl.js.org/v5/en/guide/define-rules>
* server/middleware/ability//getAbility.spec.js - passed
* server/middleware/session//jwtVerify.spec.js - passed
* server/middleware/session//setSession.spec.js - passed

* server/util//initTags.spec.js - passed
* server/api/statistics//statistics.spec.js - passed

### Opportunity API

Note these tests start the full server and mongo db so are slow to run.

* server/api/opportunity//recommendedOps.spec.js - passed
* server/api/opportunity//opportunity.util.spec.js - passed
* server/api/opportunity//opportunity.spec.js - passed
* server/api/opportunity//econreset.spec.js - passed
* server/api/opportunity//opportunity.ability.spec.js
    generally replace import uuid from 'uuid' with import { v4 as uuid } from 'uuid'

### Interest API

* server/api/interest//interest.messages.spec.js - passed
* server/api/interest//interest.ability.spec.js - passed
* server/api/interest//interest.lib.spec.js - passed
* server/api/interest//interestArchive.spec.js - passed
* server/api/interest//interestArchive.ability.spec.js - passed
* server/api/interest//interest.spec.js - passed

### ArchivedOpportunity API

* server/api/archivedOpportunity//archivedOpportunity.ability.spec.js - passed
* server/api/archivedOpportunity//archivedOpportunity.controller.spec.js - passed

### Person API

* server/api/person//personController.spec.js - passed
* server/api/person//person.spec.js - passed
* server/api/person//person.email.spec.js - passed
* server/api/person//person.subscribe.spec.js - passed
* server/api/person//person.lib.spec.js - passed
* server/api/person//person.ability.spec.js - passed

### Activity API

* server/api/activity//activity.lib.spec.js - passed
* server/api/activity//activity.ability.spec.js - passed
* server/api/activity//activity.spec.js - passed

### Location API

* server/api/location//location.spec.js - passed

### Sign Up API

* server/api/signUp//signUp.controller.spec.js - passed

### PersonalGoal API

* server/api/personalGoal//personalGoal.spec.js - passed
* server/api/personalGoal//personalGoal.subscribe.spec.js - passed
* server/api/personalGoal//personalGoal.ability.spec.js - passed
* server/api/personalGoal//GoalTests.spec.js - passed
* server/api/personalGoal//personalGoal.lib.spec.js - passed

### Member API

* server/api/member//member.controller.spec.js - passed
* server/api/member//member.spec.js - passed
* server/api/member//member.lib.spec.js - passed
* server/api/member//findMy.spec.js - passed
* server/api/member//member.ability.spec.js - passed

### Personal Verification API

* server/api/personalVerification//personalVerification.controller.spec.js - passed
* server/api/personalVerification//verified.spec.js - passed
* server/api/personalVerification//personalVerification.helpers.spec.js - passed

### Organisation API

* server/api/organisation//organisation.ability.spec.js
    * ability for org admin to update their own org is failing
    * this is due to orgAdminFor containing object ids and being compared with request _id strings. perhaps this used to work. to fix replace include with some and cast in the comparison.
* server/api/organisation//organisation.spec.js - passed
    * s and p now expects strings unquoted rather than json.
    * bad request errors can now only be returned for q={not json}
* server/api/organisation//organisation.lib.spec.js - passed
    * change to error message from mongodb exception

### Misc API

* server/api/school-lookup//school-lookup.spec.js - passed
* server/api/school-lookup//school-lookup.ability.spec.js - passed
* server/api/tag//tag.spec.js - passed
* server/api/tag//tag.controller.spec.js - passed
* server/api/story//story.ability.spec.js - passed
* server/api/story//story.spec.js - passed
* server/api/goal//loadGoals.spec.js - passed
* server/api/goal//goal.ability.spec.js - passed
* server/api/goal//goal.spec.js - passed
* server/api/badge//badge.spec.js - passed
* server/api/badge//badge.ability.spec.js - passed
* server/api/aliases//aliases.controller.spec.js - passed
* server/api/education//education.spec.js - passed
* server/api/image//image.spec.js - passed
* server/api/feedback//feedback.ability.spec.js - passed
* server/api/feedback//feedback.spec.js - passed
* server/api/file//file.controller.spec.js - passed
* server/api/school-invite//school-invite.controller.spec.js - passed

### Services

* server/services/image//imageResize.spec.js - passed
* server/services/authorize//removeUnauthorizedFields.spec.js - passed
    * replace AbilityBuilder.define with defineAbility for casl 5.
* server/services/pubsub//publishTopic.spec.js - passed
* server/services/email//email.spec.js - passed

## Remaining package updates

 mongoose   ^5.13.9  →    ^6.0.10 - Not updated due to compatability with @casl/mongoose.
