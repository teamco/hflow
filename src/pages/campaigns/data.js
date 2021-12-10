
export const cardProps = [
  {
    campaignType: 'Basic Plus',
    metadata: {
      referTo: 'basic'
    },
    price: {
      originalPrice: 93,
      discount: 34,
      discountType: 23
    },
    campaignPeriod: '100422',
    features: {
      [`accessToMessages`]: {isActive: false },
      [`dashboard`]: { isActive: true },
      [`profile`]: { isActive: true, type: 'basicProfile' },
      [`analytics`]: { isActive: true, type: 'basicAnalytics' },
      [`logoOnPartnersPage`]: { isActive: true },
      [`notifications`]: { isActive: true },
      [`placementOnMap`]: { isActive: true },
      [`requestList`]: { isActive: true }
    },
    dataset: [
      {
        accessToMessages: { isActive: true }
      },
      {
        dashboard: { isActive: true }
      },
      {
        profile: { isActive: true, type: 'basicProfile' }
      },
      {
        analytics: { isActive: true, type: 'basicAnalytics' }
      },
      {
        logoOnPartnersPage: { isActive: true }
      },
      {
        notifications: { isActive: true }
      },{
        placementOnMap: { isActive: true }
      },{
        requestList: { isActive: true }
      }
    ]
  }
]
