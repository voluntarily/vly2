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
