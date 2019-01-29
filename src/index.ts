import moment from 'moment';
import Twitter from 'twitter';

interface Tweet {
  created_at: string;
  id_str: string;
  text: string;
}

const getUserTimelineRecursive = async (
  twitter: Twitter,
  userId: string,
  until: moment.Moment,
  result?: Tweet[],
  maxId?: string
): Promise<Tweet[]> => {
  const response = await twitter.get('statuses/user_timeline', {
    count: 200,
    exclude_replies: true,
    include_rts: false,
    max_id: maxId,
    user_id: userId
  });
  const tweets = response as Tweet[];
  const d = (s: string) => moment(Date.parse(s));
  const since = moment(until).endOf('day');
  const m = tweets.filter((i) => d(i.created_at).isBetween(until, since));
  const r = (result ? result : []).concat(m);
  if (
    tweets.length === 0 ||
    tweets.length === 1 || // maxId only
    tweets.some((i) => d(i.created_at).isBefore(until))
  ) return r;
  const nextMaxId = tweets[tweets.length - 1].id_str;
  return getUserTimelineRecursive(twitter, userId, until, r, nextMaxId);
};

interface Counts { [k: string]: number; }

const count = async (): Promise<Counts> => {
  const accessTokenKey = process.env.TWITTER_ACCESS_TOKEN;
  const accessTokenSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET;
  const consumerKey = process.env.TWITTER_CONSUMER_KEY;
  const consumerSecret = process.env.TWITTER_CONSUMER_SECRET;
  if (typeof accessTokenKey === 'undefined')
    throw new Error('TWITTER_ACCESS_TOKEN is not defined');
  if (typeof accessTokenSecret === 'undefined')
    throw new Error('TWITTER_ACCESS_TOKEN_SECRET is not defined');
  if (typeof consumerKey === 'undefined')
    throw new Error('TWITTER_CONSUMER_KEY is not defined');
  if (typeof consumerSecret === 'undefined')
    throw new Error('TWITTER_CONSUMER_SECRET is not defined');
  const twitter = new Twitter({
    access_token_key: accessTokenKey,
    access_token_secret: accessTokenSecret,
    consumer_key: consumerKey,
    consumer_secret: consumerSecret
  });
  const userId = '125962981'; // bouzuya
  const until = moment().subtract(1, 'day').startOf('day');
  const tweets = await getUserTimelineRecursive(twitter, userId, until);
  const p = /^\s*おきた\s*$/;
  const t = tweets.filter((i) => i.text.match(p) !== null);
  return { wakeup: (t.length === 0 ? 0 : 1) };
};

export default count;
