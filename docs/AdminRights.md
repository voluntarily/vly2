# Admin Rights

If you have Admin status on Voluntarily you will see these changes in the system

## Client Interface

* Footer - shows menu to admin page and other entity pages. 
* MemberSection - Admins and orgAdmins see the member table of an organisation
* adminPage - access to any page wrapped in the adminPageHOC
* ActDetailPage - owner, OrgAdmin and Admin can edit the Activity
* OpDetailPage - owner, OrgAdmin and Admin can manage the Opportunity: edit, manage interested volunteers, complete and cancel
* OrgDetailPage - OrgAdmin and Admin can edit the organisation
* OrgDetailForm - Only Admin can edit the organisation role. role cannot be set to Admin except through db config. Orgs cannot make themselves Admin OP or AP and they are VP by default. A system Admin must edit the organisation to make them a school or Activity provider based on a formal request. or they are onboarded into that mode directly.
* OrgListPage - Create Organisation button.
* PersonDetailPage - Admin has newPerson Edit, Remove & ShowPeople buttons. 

### Admin Pages
* admin/invite-school
* admin/goals

## API
Admins can

* list/get all entities
* create/update all entities
* delete all entities
* carry out OrgAdmin functions for all organisations
* carry out owner functions for activities and opportunities
* view and modify person record

Thats everything really.