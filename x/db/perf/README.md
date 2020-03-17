# Performance Test - system database initialiser

The scripts here can be used to populate a new Voluntarily database with a large number of entities - people, organisations, activities, opportunities etc.

    x/db/perf/initPlatform [xs|s|m|l|xl|xxl]


It makes use of a random person user service. Which has a limit on usage. So you will need to run a local copy of the service

    git clone https://github.com/RandomAPI/Randomuser.me-Node.git
    cd Randomuser.me-Node
    npm install
    npm run build
    npm start

service runs on localhost:3000

To prevent the service limits cutting in comment out line 68 in app.js


https://github.com/RandomAPI/Randomuser.me-Node.git

This table provides counts for each type of entity created - orgs, members, activities, opportunities and interests
 
|scale|     time|    orgs|   people|  interests|
|-----|---------|--------|---------|-----------|
|   xs|    3.568|      11|       74|          8|
|    s|    3.692|      22|      336|        100|
|    m|   17.263|      44|     2864|       1200|
|    l|  435.180|     110|    38100|      12000|
|   xl|       . |     450|   250000|      24000|
|  xxl|       . |    6100|  2110000|      48000|

_Time to create on localhost (Andrew's Macbook)_