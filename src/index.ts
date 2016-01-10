import fetch from './fetch';

export default (callback: (error: Error, counts?: any) => any): void => {
  fetch()
  .then(tweets => {
    const p = /^\s*おきた\s*$/;
    const t = tweets.filter(i => i.text.match(p) !== null);
    return { wakeup: (t.length === 0 ? 0 : 1) };
  })
  .then(counts => callback(null, counts), callback);
};
