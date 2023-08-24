/**
 * @constant
 * @export
 * @type {{storageBucket: string, apiKey: string, messagingSenderId: string, appId: string, projectId: string,
 *     measurementId: string, authDomain: string}}
 */
export const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId
};
