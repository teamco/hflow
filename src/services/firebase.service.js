/**
 * Import firebase
 * @type {{initializeApp, auth}}
 */
import firebase from 'firebase/app';
import {firebaseConfig} from 'services/config/firebase.config';
import {message} from 'antd';
import capitalize from 'capitalize-first-letter';

import 'firebase/auth';
import 'firebase/firestore';
import {errorDeleteMsg, errorSaveMsg, successDeleteMsg, successSaveMsg} from 'utils/message';

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
 * @param [data]
 * @param {boolean} [notice]
 */
export const fbAdd = async ({collection, data = {}, notice = true}) => {
  return await db.collection(collection).add(data).then(async (docRef) => {
    const data = (await docRef.get()).data();
    notice && successSaveMsg(false, capitalize(collection));

    return {
      docId: docRef.id,
      data
    };
  }).catch(async error => {
    if (notice) {
      await message.error(error.message);
      errorSaveMsg(false, capitalize(collection));
    }
    console.error(`Create: ${collection}\n`, error);
    throw new Error(error);
  });
};

/**
 * @export
 * @param collection
 * @param doc
 * @param [data]
 * @param {boolean} [notice]
 * @return {Promise<{data: *, id: *}|void>}
 */
export const fbWrite = async ({collection, doc, data = {}, notice = true}) => {
  return await getRef({collection, doc}).set({...data}).then(async () => {
    notice && successSaveMsg(false, capitalize(collection));
    return await fbFindById({collection, data});
  }).catch(async error => {
    notice && await message.error(error.message);
    console.error(`Write: ${collection}\n`, error);
    throw new Error(error);
  });
};

/**
 * Read all from collection
 * @export
 * @async
 * @param collection
 * @param {boolean} [notice]
 */
export const fbReadAll = async ({collection, notice = true}) => {
  return await db.collection(collection).get().catch(async error => {
    notice && await message.error(error.message);
    console.error(`All: ${collection}\n`, error);
    throw new Error(error);
  });
};

/**
 * Limit refs
 * @export
 * @param docRef
 * @param limit
 * @return {*}
 */
export const limitBy = ({docRef, limit}) => limit ? docRef.limit(limit) : docRef;

/**
 * Order refs
 * @export
 * @param docRef
 * @param order
 * @param [at]
 * @return {*}
 */
export const orderBy = ({docRef, order, at = 'desc'}) => order ? docRef.orderBy(order, at) : docRef;

/**
 * Read from collection by condition
 * @async
 * @export
 * @param collection
 * @param field
 * @param [operator]
 * @param [optional]
 * @param value
 * @param {boolean} [notice]
 */
export const fbReadBy = async ({collection, field, operator = '==', value, notice = true, optional = {}}) => {
  const {limit, order} = optional;
  let docRef = db.collection(collection).where(field, operator, value);

  docRef = limitBy({docRef: orderBy({docRef, order}), limit});

  return await docRef.get().catch(async error => {
    notice && await message.error(error.message);
    console.error(`Read: ${collection}\n`, error);
    throw new Error(error);
  });
};

/**
 * @export
 * @param [collection]
 * @param [docRef]
 * @param [doc]
 * @param {boolean} [notice]
 * @return {Promise<firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>>}
 */
export const fbFindById = async ({docRef, collection, doc, notice = true}) => {
  docRef = docRef || getRef({collection, doc});
  return await docRef.get().catch(async error => {
    notice && await message.error(error.message);
    console.error(`Find: ${collection}\n`, error);
    throw new Error(error);
  });
};

/**
 * @export
 * @param collection
 * @param doc
 * @return {firebase.firestore.DocumentReference<firebase.firestore.DocumentData>}
 */
export const getRef = ({collection, doc}) => db.collection(collection).doc(doc);

/**
 * @async
 * @export
 * @param collection
 * @param docs
 * @param value
 * @param notice
 * @return {Promise<unknown>}
 */
export const fbMultipleUpdate = async ({collection, docs, value = {}, notice = true}) => {
  const docRefs = docs.map(doc => getRef({collection, doc}));
  return docRefs.length && db.runTransaction(transaction => {
    return transaction.get(docRefs[0]).then((sDoc) => {
      for (let docRef of docRefs) transaction.update(docRef, value);
      return value;
    });
  }).then(function(value) {
    notice && successSaveMsg(true, capitalize(collection));
    return value;
  }).catch(async error => {
    if (notice) {
      await message.error(error.message);
      errorSaveMsg(true, capitalize(collection));
    }
    console.error(`Update: ${collection}\n`, error);
    throw new Error(error);
  });
};

/**
 * Update collection
 * @async
 * @export
 * @param collection
 * @param docId
 * @param data
 * @param {boolean} [notice]
 */
export const fbUpdate = async ({collection, doc, data, notice = true}) => {
  const docRef = getRef({collection, doc});
  return await docRef.update(data).then(() => {
    notice && successSaveMsg(true, capitalize(collection));
  }).catch(async error => {
    if (notice) {
      await message.error(error.message);
      errorSaveMsg(true, capitalize(collection));
    }
    console.error(`Update: ${collection}\n`, error);
    throw new Error(error);
  });
};

/**
 * Delete collection
 * @async
 * @export
 * @param collection
 * @param doc
 * @param {boolean} [notice]
 */
export const fbDelete = async ({collection, doc, notice = true}) => {
  const docRef = getRef({collection, doc});
  return await docRef.delete().then(() => {
    notice && successDeleteMsg(capitalize(collection));
  }).catch(async error => {
    if (notice) {
      await message.error(error.message);
      errorDeleteMsg(capitalize(collection));
    }
    console.error(`Delete: ${collection}\n`, error);
    throw new Error(error);
  });
};

