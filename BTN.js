var Bot = require('./twit/examples/bot.js') , config1 = require('./twit/examples/config.js');

var bot = new Bot(config1);

console.log(' Running.');

//get date string for today's date (e.g. '2011-01-01')
function datestring () 
{
  var d = new Date(Date.now()); //- 5*60*60*1000);  //est timezone
  return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
};

console.log(datestring());

setInterval(function() {

  var params = {
  q: 'uk news',
  since: datestring(),
  result_type: 'mixed',
  lang: 'en'
}

console.log('paramsengaged');

  bot.twit.get('search/tweets', params, function(err, data, response) {
  // If there is no error, proceed
  if(!err){
    // Loop through the returned tweets
    for(let i = 0; i < data.statuses.length; i++){
      // Get the screen_name from the returned data
      let screen_name = data.statuses[i].user.screen_name;
      // THE FOLLOWING MAGIC GOES HERE
  //console.log('get complete');

      bot.twit.post('friendships/create', {screen_name}, function(err, response){
        if(err){
          console.log(err);
        } else {
          console.log(screen_name, ': **FOLLOWED**');
        }
      });
    
      bot.twit.get('search/tweets', params, function (err, reply) {
      if(err) return handleError(err);

      var max = 0, popular;

      var tweets = reply.statuses
        , i = tweets.length;

      while(i--) {
        var tweet = tweets[i]
          , popularity = tweet.retweet_count;

        if(popularity > max) {
          max = popularity;
          popular = tweet.text;
        }
      }

      bot.tweet(popular, function (err, reply) {
        if(err) return handleError(err);

        console.log('\nTweet: ' + (reply ? reply.text : reply));
      })
    });
   }
  } else {
    console.log(err);
  }
})
}, 300000);

function handleError(err) {
  console.error('response status:', err.statusCode);
  console.error('data:', err.data);
}
