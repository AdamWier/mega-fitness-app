# Mega-fitness-app
## The fitness app that's super mega
http://www.mycabinetofcuriosities.com/

## Hacktoberfest tag
Some issues are tagged Hacktoberfest because I thought they would be particularly clear or easy to understand without much explanation. If you feel like taking on an issue but need clarification, don't hesitate to ask. Whether with my project or another, happy hacking this Hacktoberfest! 🎃

### About the project
The idea for this app came from the dissatisfaction I had with other meal and exercise tracking apps in the past that didn't provide enough flexibility. Notably being able to only input food for the current day and the past but not the future or the inability to copy meals from one day to another. These were some of the first features I worked towards, essentially bringing the idea of it also being not just a meal tracking app but also a meal planning app. It has continued to evolve from there.

### Technologies used
* Node v16
* Typescript
* React Native
* Expo 
* Firestore
* Redux
* Victory (for data visualisation)
* Yarn

### Bootstrap the project
1. Fork the repo
2. [Install yarn if necessary](https://classic.yarnpkg.com/en/docs/install/) (Npm is not recommended)
3. Run ``yarn`` in the root directory (It's optional but recommended to add ``--network-timeout 100000``)
4. Create a file named ``.env`` in the root directory
5. Copy and past the following into the file: 
```
USDA_KEY=DUMMY
FIREBASE_API_KEY=DUMMY
FIREBASE_PROJECT_ID=DUMMY
FIREBASE_AUTH_DOMAIN=<<FIREBASE_PROJECT_ID>>.firebaseapp.com
FIREBASE_DATABASE_URL=https://<<FIREBASE_PROJECT_ID>>.firebaseio.com
FIREBASE_STORAGE_BUCKET=<<FIREBASE_PROJECT_ID>>.appspot.com
```
#### USDA Api Key
6. A key for the USDA's Food Central API can be acquired here: https://fdc.nal.usda.gov/api-key-signup.html
7. Once you receive the key, replace the DUMMY value in the .env project with this key
#### Firebase API keys
8. Go to https://firebase.google.com/ and sign up for a google account or sign in if you already have one
9. Click "Go to console" in the top right corner
10. Click the "Create a project" button
11. Enter any name you like
12. Use the default settings, accept the conditions, and your project will be created
13. On the project homepage, click the gear icon to the left and go to "Project settings"
14. Here you will see "project id" (FIREBASE_PROJECT_ID) and "web api key" (FIREBASE_API_KEY); copy these values into the corresponding variables
15. Make sure to also replace <<FIREBASE_PROJECT_ID>> in the other variables
16. When this is done, you should be able to launch the project by using the commnad ``yarn start`` (You can add ``-c`` if you ever need to clear the cache)
17. To run the app on your physical device or an emulator please see Expo's instructions https://reactnative.dev/docs/0.60/getting-started
(The app no longer runs in their web view due to certain component incompatibilities. It has also not been tested or adapted for iOS because I don't own an iPhone, but if you're interested in doing that, feel free to submit any pull requests to make it happen! I have only tested this app on Android physical devices.)

### Contributing to the project
Feel free to contibute an idea you have by forking the repository and making a pull request. If you want to see features I have in mind, take a look at the current version in development (v1.3 for example) under the Projects tab and feel free to assign yourself to an issue. If possible, please include "Close #<<Number of issue in this repository or if no issue, the number of the pull request with the angle brackets>>" in the commit for a minimum of tracability. Thanks and welcome to the project!