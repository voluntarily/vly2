# Interest Components

These components display and update the Interest record that tracks the link between a person and an opportunity. 

## CRUD 
### InterestItem
Short line displaying an interest in raw state. 

### InterestTable
Show interested parties for a given opportunity id
formatted using AntD table
Should allow sorting by rank, selecting a group for a group action and action buttons for individuals to invite or decline etc.


### InterestSection
Display an interest relation differently depending on state and provide buttons to change state
Gets data from server

### RegisterInterestSection
Logic allowing a user to register their interest in an opportunity. Differs from InterestSection, which displays a summary of interested parties to an op owner.
Gets data from server