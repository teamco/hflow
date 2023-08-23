import { signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseAppAuth } from '@/services/firebase.service';

/**
 * @export
 * @async
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{result: *} | {error: *}>}
 */
export const usePasswordAuth = async ({ email, password }) => {
  return signInWithEmailAndPassword(firebaseAppAuth, email, password).then((userCredential) => {
    // The signed-in user info.
    return {
      credential: userCredential,
      result: { user: userCredential.user }
    };

  }).catch((error) => {
    return { error };
  });
};