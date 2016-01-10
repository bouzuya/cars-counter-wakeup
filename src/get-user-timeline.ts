import Twitter from 'twitter';

const toCamelCase = (s: string) =>
  s.replace(/_(.)/g, (_, c) => c.toUpperCase());
const buildParameters = (parameterNames: Array<string>, options: any) => {
  const parameters = {};
  parameterNames.forEach(parameterName => {
    const optionName = toCamelCase(parameterName);
    const optionValue = options[optionName];
    if (optionValue) parameters[parameterName] = optionValue;
  });
  return parameters;
};

type UserTimelineParameters = {
  user_id?: UserId,
  screen_name?: string,
  since_id?: TweetId,
  count?: number,
  max_id?: TweetId,
  trim_user?: boolean,
  exclude_replies?: boolean,
  contributor_details?: boolean
  include_rts?: boolean
};
type UserTimelineOptions = {
  userId?: UserId,
  screenName?: string,
  sinceId?: TweetId,
  count?: number,
  maxId?: TweetId,
  trimUser?: boolean,
  excludeReplies?: boolean,
  contributorDetails?: boolean
  includeRts?: boolean
};

const getUserTimeline = (
  twitter: Twitter,
  options: UserTimelineOptions
): Promise<Array<Tweet>> => {
  return new Promise((resolve, reject) => {
    const url = 'statuses/user_timeline';
    const parameterNames = [
      'user_id',
      'screen_name',
      'since_id',
      'count',
      'max_id',
      'trim_user',
      'exclude_replies',
      'contributor_details',
      'include_rts'
    ];
    const parameters = buildParameters(parameterNames, options);
    twitter.get(url, parameters, (error, timeline) => {
      if (error) {
        reject(error);
      } else {
        resolve(timeline);
      }
    });
  });
};

export default getUserTimeline;