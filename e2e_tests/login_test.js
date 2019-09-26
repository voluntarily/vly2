
Feature('UxDesign');

Scenario('Test web and Rest', (I) => {
    console.log("inside test");
    I.amOnPage('https://github.com');         
    I.sendGetRequest('/api/users.json');
    
});
