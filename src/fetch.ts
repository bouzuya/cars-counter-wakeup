import Twitter from 'twitter';
import getUserTimeline from './get-user-timeline';
import moment from 'moment';

const getUserTimelineRecursive = (
  twitter: Twitter,
  userId: UserId,
  until: moment.Moment,
  result?: Array<Tweet>,
  maxId?: TweetId
): Promise<Array<Tweet>> => {
  return getUserTimeline(twitter, {
    userId, maxId,
    count: 200,
    includeRts: false,
    excludeReplies: true
  })
  .then((tweets: Array<Tweet>) => {
    const d = (s: string) => moment(Date.parse(s));
    const since = moment(until).endOf('day');
    const m = tweets.filter(i => d(i.created_at).isBetween(until, since));
    const r = (result ? result : []).concat(m);
    if (
      tweets.length === 0 ||
      tweets.length === 1 || // maxId only
      tweets.some(i => d(i.created_at).isBefore(until))
    ) return r;
    const newMaxId = tweets[tweets.length - 1].id_str;
    return getUserTimelineRecursive(twitter, userId, until, r, newMaxId);
  });
}

export default (): Promise<Array<Tweet>> => {
  const twitter = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  });
  const userId = '125962981'; // bouzuya
  const until = moment().subtract(1, 'day').startOf('day');
  return getUserTimelineRecursive(twitter, userId, until);
};
