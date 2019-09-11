## Getting started with OpenBadge

Explaination about what is OpenBadge and what does it do can be found in the resource bellow
 
  - [Jira documentation about OpenBadge](https://voluntarily.atlassian.net/wiki/spaces/VP/pages/41910278/Background+information)
  - [Badge functional requrirement](https://voluntarily.atlassian.net/wiki/spaces/VP/pages/41910360/Voluntarily+badge+features)

For anyone who is too lazy to read about the history, digital badges basically is just an image with encoded data in there to acknowledged someone for doing something, learn something new etc.

## Technology used

We are gonna used Badgr for issuing new badge

### Badgr API docs

To use Badgr API  you gonna need to create an account to issue or store badge for testing. More detail can be found [here](https://api.badgr.io/docs/v2)

### How to get started? 

    - Create Badgr developer account. (Pss: it's freeee)
    - Ask core Voluntarily team to add you as a staff in Issuers using your email
    - Have a read at the Badgr API docs before jump into code
    - Get access token by following the docs

### Q&A

1. How do I issue a badge to someone?
    
First, read the docs. If you dont understand it, you can try to run these request bellow to try out (Pss: need to get your token to authenticate a request)

To get authenticate run a POST request to this endpoint: ```https://api.badgr.io/o/token?username=USE_YOUR_BADGR_USERNAME&password=YOUR_BADGR_PASSWORD```

The request will return something like the json bellow

```javascript
{
    "access_token": "USE THIS ACCESS TOKEN",
    "token_type": "Bearer",
    "expires_in": 86400,
    "refresh_token": "DONT WORRY ABOUT IT FOR NOW",
    "scope": "rw:profile rw:issuer rw:backpack"
}
```

TO query all badges the issuer has, run a GET request with Bearer Token from the json above to this url ```https://api.badgr.io/v2/badgeclasses```

The body of the response is in the format bellow:

```javascript
    {
    "status": {
        "description": "ok",
        "success": true
    },
    "result": [
        {
            "entityType": "BadgeClass",
            "entityId": "Badge ID ",
            "openBadgeId": "url type of the badge",
            "createdAt": "String",
            "createdBy": "ID of user in the issuers create this badge",
            "issuer": "Issuer ID ",
            "issuerOpenBadgeId": "URL of the user",
            "name": "React expert",
            "image": "URL type link to the location of the badge image",
            "description": "String",
            "criteriaUrl": null,
            "criteriaNarrative": "Some narative about the badge",
            "alignments": [],
            "tags": [],
            "expires": {
                "amount": null, 
                "duration": null // Depends on the person who create this badge
            },
            "extensions": {}
        }
    ]
}
```

