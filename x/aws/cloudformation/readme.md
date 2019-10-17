The fargate.yml file is a cloudfomation template for creating an AWS fargate stack/cluster for vly

To create a new cluster run
aws cloudformation deploy --capabilities CAPABILITY_NAMED_IAM --template-file fargate.yml --stack-name cf-wip

where cf-wip is the stack name (could be alpha/beta/prod or whatever you like)

You will probably want to also set
ServiceName
DbUriBase
AppUrl

Note the following other changes will be required for a new deployment
## Deploy an image 
use deploy-{target} to copy from alpha to {target} or use a common image


## Domain:  
101Domain.com nameserver records 
create a CNAME record for the site subdomain e.g gamma.voluntarily.nz and point this at the load balancer created. 
beta CNAME voluntarily-beta-load-balancer-587146228.ap-southeast-2.elb.amazonaws.com.

## Auth0
add the new service to the whitelist of authentication endpoints.
