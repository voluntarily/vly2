VP-1362 Notes.md
# OpDetailPage

## OpVolunteerInterestSection
- no data fetching, no redux.
### props
* canRegisterInterest true (isAuthenticated && !isOwner)
* isAuthenticated true
* meID "5e56d1fb1755ff390cebfe5d"
* opID "5d2903f8a792f000114a552f"

if not authenticated then we show an I'm interested button which signs the person in and returns to the page. 

If person is the owner we hide the entire interested section
otherwise show the RegisterInterestComponent

## RegisterInterestSection
DataProvider 
gets the required data for the children. 
redux attached to interests.
handles button clicks from the children to update interests. 
### props
* dispatch dispatch
* interests {data: Array(1), error: null, loading: false, reque…}
* interestsActions fn
* meID "5e56d1fb1755ff390cebfe5d"
* opID "5d2903f8a792f000114a552f"

## RegisterInterestItem
interest {_id: "5e56d91747407843da725789", __v: 0, comment: …}
onChangeStatus bound handleChangeStatus
onWithdraw bound handleWithdraw

## HOCS
the higher order components PublicPage and SecurePage have been replaced. 
_App now does the overall layout that public page used to do.  If a page requires a specific layout it can be overridden by exporting a getLayout function.

routing through to login is now handled by GuardRoutes wrapper in _App.  This has a list of routes that require the user to be signed in.  There's not as many as you would think as much of the site is public. However even public pages may expect a me and isAuthenticated values in the store so that they can control what gets displayed to the public. 

## GetServerSideProps

All GetInitialProps get replaced with GSSP.


## COnvert everntyhing to EC modules - latest JS
set module= true in package.json
replace all requires with imports.
