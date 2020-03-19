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
 
|scale|     time|    orgs|   people|  activities| opportunities|  interests| AWS Time |
|-----|---------|--------|---------|------------|--------------|-----------|----------|
|   xs|    3.568|      11|       74|           2|             4|          8|          |
|    s|    3.692|      22|      336|           4|            20|        120|          |
|    m|   276.50|      44|     2864|          10|           100|       1200| 3m59.570s|
|    l|  435.180|     110|    23100|          50|          1000|      12000| 36m32.321s         |
|   xl|       . |     450|   250000|         100|          2000|      24000|          |
|  xxl|       . |    6100|  2110000|         200|          4000|      48000|          |
|-----|---------|--------|---------|------------|--------------|-----------|----------|

_Time to create on localhost (Andrew's Macbook)_