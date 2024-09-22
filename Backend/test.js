import { formatInTimeZone } from 'date-fns-tz';

const timezone = 'UTC';

console.log(formatInTimeZone(new Date('2024-09-04T18:55:36.559Z'), timezone, 'MMMM d, yyyy h:mm a zzz'));