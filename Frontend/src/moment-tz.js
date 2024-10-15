// utils/dateUtils.js
import moment from 'moment-timezone';

export function formatDate(date) {
  return moment(date).tz('America/New_York').format('MMMM DD, YYYY hh:mm:ssA z');
}