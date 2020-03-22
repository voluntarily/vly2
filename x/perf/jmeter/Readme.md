# Using JMeter to performance test Voluntarily.

## Installation - for Mac
Java is required
Using Brew installer

    brew install jmeter
or
    brew install jmeter --with-plugins

run
    jmeter

or
    open /usr/local/bin/jmeter


Don't use GUI mode for load testing !, only for Test creation and Test debugging.
For load testing, use CLI Mode (was NON GUI):
   jmeter -n -t [jmx file] -l [results file] -e -o [Path to web report folder]
   jmeter -n -t 'x/jmeter/Voluntarily API.jmx' -l x/jmeter/results -e -o x/jmeter/webout
& increase Java Heap to meet your test requirements:
   Modify current env variable HEAP="-Xms1g -Xmx1g -XX:MaxMetaspaceSize=256m" in the jmeter batch file
Check : https://jmeter.apache.org/usermanual/best-practices.html

# Test Plans
plans are stored in the x/jmeter folder.

## Voluntarily API
Baseline load and response time test using /api/health. This api call does not require db access so should respond about as fast as possible.

