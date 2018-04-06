// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
export const environment = {
  production: true,
  firebase: {
    apiKey: "AIzaSyDV_VZyZYxawGjAqUaYd05HM-3eQB7BrBs",
    authDomain: "elishcrm.firebaseapp.com",
    databaseURL: "https://elishcrm.firebaseio.com",
    projectId: "elishcrm",
    storageBucket: "elishcrm.appspot.com",
    messagingSenderId: "684836951514"
  },
  googleMapsKey: 'AIzaSyCPvQ2QgfzH1zLfNBd8nWmaoAAuKgMU_hk'
};