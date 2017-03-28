var defaultDemos = {
  "lead_capture_automation": {
    "id": "lead_capture_automation",
    "account": "ecom_acct_id",
    "name": "Basic Demo: Lead capture and email automation.",
    "documentation": "https://gist.github.com/markhayden/1c7bfa8f6258ae8950e596f2a4ca8843",
    "url": "http://ecom.lyticsdemo.com",
    "description": "Demonstration of a cross channel marketing effort. It starts by identifying an unknown web visitor via web personalization. Engaging them with an affinity based email and finally helping engage further with web based content recommendations.",
    "whiteListedProfiles": [
      "default",
      "james"
    ],
    "supportingTabs": [
      "http://ecom.lyticsdemo.com?demo=lead_capture_automation",
      "https://activate.getlytics.com/user/_uids/76294.29714676953",
      "https://mail.google.com/mail/u/0/#label/Lytics+Demo",
      "https://lytics.createsend.com/automation/reports/viewCampaign.aspx?d=d&c=6546EE8F416514F4&ID=0E055995CB3D7A84&temp=False&tx=0",
      "https://activate.getlytics.com",
      "https://lytics.createsend.com/login?ReturnUrl=&username=mark%2Blyticsdemo%40lytics.io&password=weathered.hurricane.vengeance.P90X"
    ]
  },
  "ecom_content_reco": {
    "id": "ecom_content_reco",
    "account": "ecom_acct_id",
    "name": "Ecommerce Content Recommendation",
    "documentation": "http://google.com",
    "url": "http://ecom.lyticsdemo.com",
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc non nisi efficitur, feugiat felis et, dignissim augue. Donec posuere tincidunt feugiat. Quisque ut velit varius, pulvinar lectus vel, commodo libero. Etiam vitae nulla fringilla, euismod elit vel, efficitur enim.",
    "whiteListedProfiles": [
      "hodor",
      "jon",
      "daenerys"
    ]
  },
  "ecom_lead_gen": {
    "id": "ecom_lead_gen",
    "account": "ecom_acct_id",
    "name": "Ecommerce Lead Generation",
    "documentation": "http://google.com",
    "url": "http://ecom.lyticsdemo.com",
    "description": "Attack the dog then pretend like nothing happened thinking longingly about tuna brine. Friends are not food cat snacks, so hiss at vacuum cleaner destroy couch, but cat is love, cat is life. Chew foot stand in front of the computer screen, yet annoy owner until he gives you food say meow repeatedly until belly rubs, feels good.",
    "whiteListedProfiles": [
      "hodor",
      "jon",
      "daenerys"
    ]
  },
  "unscripted": {
    "id": "unscripted",
    "account": "",
    "name": "Unscripted Demo",
    "documentation": "",
    "url": "",
    "description": "Unscripted demos allow advanced users to manually set the account id as well as profiles to be used. This may result in mock data being sent to live accounts. Please use with caution.",
    "whiteListedProfiles": []
  }
};

module.exports = defaultDemos;