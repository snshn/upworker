import request from 'request';
import FeedParser from 'feedparser';
import moment from 'moment';
import playSound from 'play-sound';
import colors from 'colors';
import _ from 'lodash';
import decode from 'decode-html';
import fs from 'fs';
import say from 'say';

import config from './config.js';

// The stack of target URLs (can't be const, need to shift and push items)
var urls = config.urls.slice(0);

// Pretend to be Mozilla Thunderbird
const request_options = {
    // url: URL,
    headers: {
      'Host': 'www.upwork.com',
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:52.0) Gecko/20100101 Thunderbird/52.1.1',
      'Accept': 'application/atom+xml,application/rss+xml;q=0.9,application/rdf+xml;q=0.8,application/xml;q=0.7,text/xml;q=0.7,*/*;q=0.1',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate',
      'If-Modified-Since': 'Sat, 01 Jan 2000 00:00:00 GMT',
      'Connection': 'keep-alive',
      'Pragma': 'no-cache',
      'Cache-Control': 'no-cache'
    }
  };

const player = playSound({});

// Create file called "known" if it does not exist
fs.writeFileSync('known.txt', '', { overwrite: false });

// Import known URLs from the last session
let known = fs.readFileSync('known.txt', 'utf-8').split('\n').filter(Boolean) || [];

var audible_alerts = [];
for (var i = 0, ilen = config.keywords.length; i < ilen; i++) {
  audible_alerts[config.keywords[i]] = _.debounce((function (sound) {
    return () => {
        say.speak(sound, 'Alex', 1.0);
      };
  })(config.keywords[i]), 1000);
}

const dong = _.debounce(function(){
  player.play('sounds/silent_click.wav')
}, 500)

function interesting(string) {
  for (let i = 0, ilen = config.keywords.length; i < ilen; i++) {
    if (string.toLowerCase().match(config.keywords[i])) {
      return config.keywords[i];
    }
  }
}

function _read_the_feed(url) {
  request_options.url = url;

  let req = request(request_options);
  let feedparser = new FeedParser({ addmeta: false });

  req.on('error', function (error) {
    //console.error('Request Error:', error)
  });

  req.on('response', function (res) {
    if (res.statusCode !== 200) {
      this.emit('error', new Error('Bad status code'));
    } else {
      this.pipe(feedparser);
    }
  });

  feedparser.on('error', function (error) {
    console.error('FeedParser Error:', error)
  });

  feedparser.on('readable', function () {
    let item

    while (item = this.read()) {
      if (~known.indexOf(item.link)) {
        continue
      }

      known.push(item.link)
      fs.appendFileSync('known.txt', item.link + '\n')

      if (moment(item.pubdate).valueOf() < Date.now() - config.expiration) {
        // Too old!
        continue;
      }

      let date = moment(item.pubdate).format('HH:MM:ss');
      let title = decode(decode(item.title.slice(0, -9)));
      let important = interesting(title + ' ' + item.description);

      if (important) {
        audible_alerts[important]();

        console.log(date.inverse.red, '[' + important + ']',
                    title.red, '(' + item.link + ')'); // Highlighted
      } else {
        dong();

        console.log(date.inverse, title, '(' + item.link.white + ')');
      }

      console.log('');
    }
  });
}

function read_all_feeds() {
  // Query the first URL in the stack
  _read_the_feed(urls[0]);

  // Move the first URL to the end of the stack
  urls.push(urls.shift());
}

// Initial run
read_all_feeds();
// Initiate the loop
setInterval(read_all_feeds, config.interval * 1000);
