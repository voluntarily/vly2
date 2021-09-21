# VP-1702 Package updates Sept 2021. 

Goal - bring the Voluntarily code base up to latest versions of the major packages in use. 
Ensure we have all necessary security patches, and remain on Long term support (LTS) versions of the framework and tools.

Remove any package warnings and use of deprecated features. 
Remove any redundant packages.

## Major updates:

### Node - 14 -> 16.
Updated Dockerfile 

docker compose - 3.4 -> 3.9
React -16.12.0 -> 17. # 
NextJS 9 -> 11

# Actions
* checkout and build, run tests - 1 failure, not reproducible
* build and run up the local docker compose files. 
* commit and check build runs on github.

* bunch of time spent getting mongoose-crudify to work, code base on git keeps switching to ssh access which doesn't work.  consider pushing to npm. 
* 

# Test failures
-   server › api › interest › interest.ability › Interest API - anon - list
    -   not repeatable.