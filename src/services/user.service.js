import { message } from 'antd';
import _ from 'lodash';
import gravatar from 'gravatar';

import i18n from '@/utils/i18n';
import { fbReadAll, fbReadBy, fbUpdate, firebaseAppAuth } from 'services/firebase.service';
import { errorSaveMsg } from '@/utils/message';
import { isAdmin } from 'services/userRoles.service';

/**
 * @export
 * @param email
 * @param options
 * @param protocol
 * @return {*}
 */
export const gravatarUrl = ({ email, options = {}, protocol = 'http' }) => {
  return gravatar.url(email, options, protocol);
};

/**
 * @export
 * @param email
 * @param options
 * @param protocol
 * @return {string}
 */
export const gravatarProfile = ({ email, options = {}, protocol = 'http' }) => {
  return gravatar.profile_url(email, options, protocol);
};

/**
 * @export
 * @param user
 * @return {Promise<{data: *[]}|*[]>}
 */
export const getUsers = async ({ user }) => {
  let data = [];

  if (!user) {
    return data;
  }

  /**
   * @constant
   * @type {{forEach}}
   */
  const users = isAdmin(user.roles) ?
      await fbReadAll({ collection: 'users' }) :
      await fbReadBy({
        collection: 'users',
        field: 'uid',
        value: user.uid
      });

  users.forEach(doc => {
    const _data = doc.data();
    data.push(_.merge(_data, { id: doc.id }));
  });

  return { data };
};

/**
 * @export
 * @param uid
 * @param [email]
 * @param [emailVerified]
 * @param [metadata]
 * @return {Promise<{data: {}, docId: *}>}
 */
export const findUser = async ({ uid, email, emailVerified, metadata }) => {
  let data = {};
  let docId = undefined;

  /**
   * @constant
   * @type {{error}|firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>}
   */
  const users = await fbReadBy({ collection: 'users', field: 'uid', value: uid });

  if (users?.error) {
    return { docId, data, error: users?.error };
  } else {
    users?.forEach(doc => {
      const _data = doc.data();
      if (_data.uid === uid) {
        docId = doc.id;
        data = _.merge(_data, { email, emailVerified, metadata });
      }
    });

    return { docId, data };
  }
};

/**
 * @export
 * @async
 * @return {Promise<[]>}
 */
export const getAllUserRoles = async () => {
  const data = [];

  /**
   * @constant
   * @type {{forEach}}
   */
  const roles = await fbReadAll({ collection: 'roleTypes' });
  roles.forEach(doc => {
    const _data = doc.data();
    data.push({
      id: doc.id,
      type: _data.type
    });
  });

  return data;
};

/**
 * @export
 * @param uid
 * @param email
 * @return {Promise<{docId, data: {metadata}}|void>}
 */
export const forceSignOutUser = async ({ uid, email }) => {

  /**
   * @constant
   * @type {{docId, data: {metadata}}}
   */
  const user = await findUser({ uid });

  if (!user) {
    return errorSaveMsg(true, email);
  }

  const metadata = {
    ...user.data.metadata,
    ...{
      forceSignOut: true,
      signedIn: false,
      updatedAt: +(new Date)
    }
  };

  await fbUpdate({ collection: 'users', doc: user.docId, data: { metadata } });

  return user;
};

/**
 * @export
 * @constant
 */
export const handleUserSessionTimeout = () => {
  firebaseAppAuth.onAuthStateChanged(user => {
    let userSessionTimeout = null;
    if (user === null && userSessionTimeout) {
      clearTimeout(userSessionTimeout);
      userSessionTimeout = null;
    } else {
      user && user.getIdTokenResult().then((idTokenResult) => {
        const authTime = idTokenResult.claims.auth_time * 1000;
        const sessionDurationInMilliseconds = 60 * 60 * 1000; // 60 min
        const expirationInMilliseconds = sessionDurationInMilliseconds - (Date.now() - authTime);
        // console.info(`Session will be expired in: ${expirationInMilliseconds}ms`);
        userSessionTimeout = setTimeout(async () => {
          // await firebaseAppAuth.signOut();
        }, expirationInMilliseconds);
      });
    }
  });
};

/**
 * @export
 * @param user
 * @return {Boolean|Promise<void>}
 */
export const sendVerificationEmail = async ({ user }) => {
  const currentUser = firebaseAppAuth.currentUser;

  if (currentUser.uid === user.data().uid) {
    return await currentUser.sendEmailVerification().then(async () => {
      await message.success(i18n.t('msg:successSentVerificationEmail'));
      return message.warning(i18n.t('msg:pendingEmailVerification'));
    }).catch(async error => {
      // An error happened.
      await message.error(error.message);
      return message.error(i18n.t('msg:errorSentVerificationEmail'));
    });
  } else {
    return message.warning(i18n.t('msg:errorSentVerificationEmail'));
  }
};

/**
 * You can send a password reset email to a user with the
 * sendPasswordResetEmail method.
 * @export
 * @param user
 */
export const resetUserPassword = ({ user }) => {
  return firebaseAppAuth.sendPasswordResetEmail(user.email).then(async () => {
    // Email sent.
    return message.success(i18n.t('msg:successPasswordResetEmail'));
  }).catch(async error => {
    // An error happened.
    await message.error(error.message);
    return message.error(i18n.t('msg:errorSentPasswordResetEmail'));
  });
};

/**
 * @export
 */
export const deleteFbUser = () => {
  const currentUser = firebaseAppAuth.currentUser;
  currentUser.delete().then(() => {
    // Update successful.
  }).catch(async error => {
    // An error happened.
    await message.error(error.message);
  });
};

/**
 * @export
 * @param email
 */
export const updateFbUserEmail = ({ email }) => {
  const currentUser = firebaseAppAuth.currentUser;
  currentUser.updateEmail(email).then(() => {
    // Update successful.
  }).catch(async error => {
    // An error happened.
    await message.error(error.message);
  });
};

/**
 * @export
 * @param password
 */
export const updateFbUserPassword = ({ password }) => {
  const currentUser = firebaseAppAuth.currentUser;
  currentUser.updatePassword(password).then(() => {
    // Update successful.
  }).catch(async error => {
    // An error happened.
    await message.error(error.message);
  });
};

/**
 * @export
 * @param profile
 */
export const updateFbUserProfile = ({ profile = {} }) => {

  /**
   * Get current FB user.
   * @type {{updateProfile}}
   */
  const currentUser = firebaseAppAuth.currentUser;

  currentUser.updateProfile(...profile).then(() => {
    // Update successful.
  }).catch(async error => {
    // An error happened.
    await message.error(error.message);
  });
};

/**
 * @export
 * @async
 * @link https://firebase.google.com/docs/auth/web/email-link-auth
 * @param {{url, userId}} setting
 * @param {string} email
 */
export const sendAuthLink = async ({ setting, email }) => {

  /**
   * @constant
   * @example
   * <url>: The deep link to embed and any additional state to be passed along.
   * The link's domain has to be added in the Firebase Console list of authorized domains,
   * which can be found by going to the Sign-in method tab (Authentication -> Sign-in method).
   * <android> and <ios>: The apps to use when the sign-in link is opened on an Android or iOS device. Learn more on how
   * to configure Firebase Dynamic Links to open email action links via mobile apps.
   * <handleCodeInApp>: Set to true. The sign-in operation has to always be completed in the app unlike other out of
   * band email actions (password reset and email verifications). This is because, at the end of the flow, the user
   * is expected to be signed in and their Auth state persisted within the app.
   * <dynamicLinkDomain>: When multiple custom dynamic link domains are defined for a project, specify which one to
   * use when the link is to be opened via a specified mobile app (for example, example.page.link).
   * Otherwise the first domain is automatically selected.
   * @type {{handleCodeInApp: boolean, url: string, iOS, android, dynamicLinkDomain}}
   */
  const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    url: `${setting.url}/admin/finishSignUp/${setting.userId}`,
    // This must be true.
    handleCodeInApp: true
    // iOS: {
    //   bundleId: 'com.example.ios'
    // },
    // android: {
    //   packageName: 'com.example.android',
    //   installApp: true,
    //   minimumVersion: '12'
    // },
    // dynamicLinkDomain: 'example.page.link'
  };

  return await firebaseAppAuth.sendSignInLinkToEmail(email, actionCodeSettings).then(async () => {
    // The link was successfully sent. Inform the user.
    // Save the email locally so you don't need to ask the user for it again
    return message.success(i18n.t('msg:linkSent'));
  }).catch(async error => {
    await message.error(i18n.t('msg:errorLinkSend'));
    return message.error(error.message);
  });

};
