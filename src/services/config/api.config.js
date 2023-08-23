const API = {
  avatar: 'https://avatars.dicebear.com/api/male/john.svg',
  auth: {
    token: 'auth/token',
    refresh: 'auth/refresh'
  },
  users: {
    get: 'users/:userKey',
    store: 'users',
    subscription: 'users/:userKey/subscription/:subscriptionKey'
  },
  profile: {
    get: 'users/:userKey/profile/:profileKey',
    store: 'users/:userKey/profile',
    emails: 'users/:userKey/profile/:profileKey/emails',
    logos: 'users/:userKey/profile/:profileKey/logos',
    links: 'users/:userKey/profile/:profileKey/links',
    addresses: 'users/:userKey/profile/:profileKey/addresses',
    list: 'users/profiles',
    overview: 'users/profiles/:profileKey'
  },
  features: {
    get: 'features/:featureKey',
    store: 'features',
    delete: 'features/:featureKey'
  },
  campaigns: {
    get: 'campaigns/:campaignKey',
    store: 'campaigns',
    delete: 'campaigns/:campaignKey'
  },
  subscriptions: {
    get: 'subscriptions/:subscriptionKey',
    store: 'subscriptions',
    delete: 'subscriptions/:subscriptionKey'
  },
  schedulers: {
    get: 'schedulers/:schedulerKey',
    store: 'schedulers',
    delete: 'schedulers/:schedulerKey'
  },
  apartments: {
    get: 'apartments/:apartmentKey',
    preview: 'apartments/preview',
    userLikes: 'apartments/preview/:userKey/liked',
    userViews: 'apartments/preview/:userKey/viewed',
    userRank: 'apartments/preview/:userKey/rated',
    store: 'apartments'
  },
  addresses: {
    get: 'addresses/:addressKey',
    rules: 'addresses/rules',
    store: 'addresses'
  },
  views: {
    store: 'views'
  },
  likes: {
    store: 'likes',
    delete: 'likes/:likeKey',
  }
};

module.exports = { API };

