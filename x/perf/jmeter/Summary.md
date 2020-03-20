Summary.md

Voluntarily API - Health test 
100 users, 400 secs 100 loops - 10000 tx,  24tx/sec - Zero errors.
200 users, 400 secs 100 loops - 20000 tx,  24tx/sec - 0.61% errors

# 2020-03-18T13:29 - 30 minute API stress test - api/health
- file Voluntarily API.jmx
50000 requests to api/health. ( 1600/minute)
average 30sec response time. Error 27, 0.05%
2 servers - reduced to 1 halfway through.
APDEX - 0.789
summary =  50000 in 00:28:02 =   29.7/s Avg:   914 Min:    52 Max: 89678 Err:    27 (0.05%)

# 2020-03-18T13:29 - 30 minute Page load baseline - /orgs
# Wed Mar 18 14:10:23 NZDT 2020 - Page load baseline - /orgs
- file Voluntarily Pages.jmx
  
target - 300 page loads per minute. ( 5 per second ) zero errors 36k size.
target mean response time 1.2 secs.
APDEX - 0.086

2500 samples, 2 errors, (4.46 tx per second), response time 3.7 secs
server cpu utilisation not that high - load limited by the db request.

APDEX - 0.231
1000 samples, 1 error, (3.95 tx per second), avg response 1.7 secs.

# Wed Mar 18 15:11:35 NZDT 2020 - /search?search-fortran
APDEX - 0.963
1000 samples, 1 error, (3.37 tx per second), respond 400ms (95th 894ms)

# Wed Mar 18 15:31:22 NZDT 2020 - run 2
APDEX - 0.902
1500 samples, 0 error, (3.37 tx per second), response 444ms (95th 982ms)

# Wed Mar 18 16:49:08 NZDT 2020 - /search ( 4 hosts)
1500 in 00:07:27 =    3.4/s Avg:   823 Min:   195 Max:  3349 Err:     6 (0.40%)

APDEX - 0.598
GET search page	1500	6	0.40%	823.28	195	3349	1296.80	1423.95	1656.00	3.36	137.25	0.48

