import { execFileSync } from 'node:child_process';
import { site } from '../src/lib/site.ts';

const [base, head] = process.argv.slice(2);
if (!base || !head) {
  throw new Error('Usage: node scripts/check-site-updated.mjs <base commit> <head commit>');
}

const sitePaths = ['src/', 'public/', 'astro.config.mjs'];
const range = `${base}...${head}`;

function git(...args) {
  return execFileSync('git', args, { encoding: 'utf8' }).trim();
}

if (!git('diff', '--name-only', range, '--', ...sitePaths)) {
  console.log('No site source or public asset changes. The footer date can stay as is.');
  process.exit(0);
}

const newYorkDate = new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/New_York' });
const headTimestamp = git('show', '-s', '--format=%cI', head);
const latestChange =
  git('log', '-1', '--no-merges', '--format=%cI', `${base}..${head}`, '--', ...sitePaths) ||
  headTimestamp;
const changedOn = newYorkDate.format(new Date(latestChange));
const headDate = newYorkDate.format(new Date(headTimestamp));

const updated = new Date(site.updated);
const validDate =
  !Number.isNaN(updated.getTime()) && updated.toISOString().slice(0, 10) === site.updated;
if (!validDate || site.updated < changedOn || site.updated > headDate) {
  const expected = changedOn === headDate ? changedOn : `${changedOn} through ${headDate}`;
  console.error(
    `The shared footer date is ${site.updated}. Set site.updated in src/lib/site.ts to ${expected} (New York time).`,
  );
  process.exit(1);
}

console.log(`The shared footer date (${site.updated}) covers the latest site change (${changedOn}).`);
