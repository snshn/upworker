'use strict'

const config = {
  'urls': [
    // Fill this array with RSS links taken from Upwork's search results page
    'https://www.upwork.com/ab/feed/jobs/rss?verified_payment_only=1&q=javascript&sort=renew_time_int+desc&api_params=1&securityToken=<YOUR_SECURITY_TOKEN>&userUid=<YOUR_UID>&orgUid=<YOUR_ORG_UID>'
  ],
  'keywords': [
    // Keywords to highlight
    'ios',
    'javascript'
  ],
  'expiration': 2 * 24 * 60 * 60 * 1000, // Ignore items older than two days
  'interval': 10 // Seconds between requests, perhaps can be less but I wouldn't risk
}

module.exports = config
