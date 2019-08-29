# Processing JSON with jq
jq is a lightweight and flexible command-line JSON processor.

https://stedolan.github.io/jq/

Install it and use on the command line with the vly.js command to manage database api calls.

# People
## Get a list of all people's emails
./vly.js list people | jq '[.[] | {_id: ._id, email: .email}]'

## use Jq to find a single person
./vly.js list people | jq '[.[] | .email]'

## delete all the people
./vly.js list people | jq '[.[] | {_id: ._id, email: .email}]'

# Opportunities
Opportunities api supports filters
q= select items
s= sort 
p= pick elements


    http://localhost:3122/api/opportunities?q={%22status%22:%22active%22}&s=%22-name%22&p=%22title%22

    [{"_id":"5cc8d60b8b16812b5b3920c1","name":"What makes things grow"},{"_id":"5cdba4195c02bd7a97d8698e","name":"Example Thing to do"}]

## get active opportunities
    ./vly.js list opportunities 'q={"status":"active"}'

## get active opportunitites, sort and short titles.
 ./vly.js list opportunities 'q={"status":"active"}&s="name"&p="name"'

# Organisations
 http://localhost:3122/api/organisations?q={%22type%22:%22vp%22}&s=%22name%22