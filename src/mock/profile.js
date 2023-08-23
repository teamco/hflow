import mockjs from 'mockjs';

export default {
  'GET /api/profile': mockjs.mock({
    "profile": {
      "name": {
        "first": "Mister",
        "second": "MisterSecond",
        "middle": "Middle Name",
        "honorific": "Mr"
      },
      "Birthday": "01/02/1983",
      "gender": "male",
      "type": "business",
      "created": "01/01/2019"
    }
    })
}