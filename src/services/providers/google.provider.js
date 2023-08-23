import {
  signInWithRedirect,
  signInWithPopup,
  getRedirectResult,
  GoogleAuthProvider
} from 'firebase/auth';

import { firebaseAppAuth, providers } from '@/services/firebase.service';

/**
 * @constant
 * @param resultFn
 * @returns {Promise<{result: *, credential: OAuthCredential} | {credential: OAuthCredential, error: *}>}
 */
const handlePromisedCall = (resultFn) => {
  return resultFn.then((result) => {
    // This gives you a Google Access Token. You can use it to access Google APIs.
    const credential = GoogleAuthProvider.credentialFromResult(result);

    // The signed-in user info.
    return { credential, result };

  }).catch((error) => {
    const credential = GoogleAuthProvider.credentialFromError(error);
    return { error, credential };
  });
};

/**
 * @export
 * @async
 * @returns {Promise<{result: *, credential: OAuthCredential} | {credential: OAuthCredential, error: *}>}
 */
export const useGoogleAuthRedirect = async () => {
  return handlePromisedCall(signInWithRedirect(
      firebaseAppAuth,
      providers.googleProvider
  ));
  // debugger
  // return handlePromisedCall(getRedirectResult(firebaseAppAuth));
};

/**
 * @export
 * @async
 * @returns {Promise<{result: *, credential: OAuthCredential}|{credential: OAuthCredential, error: *}>}
 */
export const getGoogleAuthRedirectResult = async () => {
  return handlePromisedCall(getRedirectResult(firebaseAppAuth));
};

/**
 * @export
 * @async
 * @returns {Promise<{result: *, credential: OAuthCredential}|{credential: OAuthCredential, error: *}>}
 */
export const useGoogleAuthPopup = async () => {
  return handlePromisedCall(signInWithPopup(
      firebaseAppAuth,
      providers.googleProvider
  ));
};