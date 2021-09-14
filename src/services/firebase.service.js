/**
 * Import firebase
 * @type {{initializeApp, auth}}
 */
import firebase from 'firebase/app';
import { firebaseConfig } from 'services/config/firebase.config';
import { message } from 'antd';
import capitalize from 'capitalize-first-letter';

import 'firebase/auth';
import 'firebase/firestore';
import { errorSaveMsg, successSaveMsg } from 'utils/message';

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

/**
 * @export
 * @constant
 */
export const firebaseAppAuth = firebaseApp.auth();

/**
 * See the signature above to find out the available providers.
 * @export
 * @param {string} provider
 * @param firebase
 * @return {*}
 */
export const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
  facebookProvider: new firebase.auth.FacebookAuthProvider(),
  twitterProvider: new firebase.auth.TwitterAuthProvider(),
  githubProvider: new firebase.auth.GithubAuthProvider()
  // oauthProvider: new firebase.auth.OAuthProvider(),
  // phoneAuthProvider: new firebase.auth.PhoneAuthProvider()
};

/**
 * @export
 * @return {Promise<void>}
 */
export const fbSignOut = async () => {
  await firebaseAppAuth.signOut();
};

/**
 * Create firebase new collection
 * @export
 * @async
 * @param collection
 * @param data
 */
export const fbAdd = async ({ collection, data = {} }) => {
  return await db.collection(collection).add(data).then(async (docRef) => {
    const data = (await docRef.get()).data();
    successSaveMsg(false, capitalize(collection));

    return {
      docId: docRef.id,
      data
    };
  }).catch(async error => {
    await message.error(error.message);
    errorSaveMsg(false, capitalize(collection));
    console.error(`Create: ${collection}\n`, error);
    return {};
  });
};

/**
 * @export
 * @param collection
 * @param doc
 * @param data
 * @return {Promise<{data: *, id: *}|void>}
 */
export const fbWrite = async ({ collection, doc, data = {} }) => {
  await getRef({ collection, doc }).set({ ...data }).catch(async error => {
    await message.error(error.message);
    console.error(`Write: ${collection}\n`, error);
  });
  successSaveMsg(false, capitalize(collection));
  return await fbFindById({ collection, data });
};

/**
 * Read all from collection
 * @export
 * @async
 * @param collection
 */
export const fbReadAll = async ({ collection }) => {
  return await db.collection(collection).get().catch(async error => {
    await message.error(error.message);
    console.error(`All: ${collection}\n`, error);
    return [];
  });
};

/**
 * Read from collection by condition
 * @async
 * @export
 * @param collection
 * @param field
 * @param operator
 * @param value
 */
export const fbReadBy = async ({ collection, field, operator = '==', value }) => {
  return await db.collection(collection).where(field, operator, value).get().catch(async error => {
    await message.error(error.message);
    console.error(`Read: ${collection}\n`, error);
    return [];
  });
};

/**
 * @export
 * @param [collection]
 * @param [docRef]
 * @param [doc]
 * @return {Promise<firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>>}
 */
export const fbFindById = async ({ docRef, collection, doc }) => {
  docRef = docRef || getRef({ collection, doc });
  return await docRef.get().catch(async error => {
    await message.error(error.message);
    console.error(`Find: ${collection}\n`, error);
    return {};
  });
};

/**
 * @export
 * @param collection
 * @param doc
 * @return {firebase.firestore.DocumentReference<firebase.firestore.DocumentData>}
 */
export const getRef = ({ collection, doc }) => db.collection(collection).doc(doc);

/**
 * Update collection
 * @async
 * @export
 * @param collection
 * @param docId
 * @param data
 */
export const fbUpdate = async ({ collection, docId, data }) => {
  const docRef = getRef({ collection, doc: docId });
  return await docRef.update(data).then(() => {
    successSaveMsg(true, capitalize(collection));
  }).catch(async error => {
    await message.error(error.message);
    errorSaveMsg(true, capitalize(collection));
    console.error(`Update: ${collection}\n`, error);
  });
};
