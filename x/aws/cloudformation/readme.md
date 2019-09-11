The fargate.yml file is a cloudfomation template for creating an AWS fargate stack/cluster for vly

To create a new cluster run
aws cloudformation deploy --capabilities CAPABILITY_NAMED_IAM --template-file fargate.yml --stack-name cf-wip

where cf-wip is the stack name (could be alpha/beta/prod or whatever you like)

You will probably want to also set
ServiceName
DbUriBase
AppUrl
