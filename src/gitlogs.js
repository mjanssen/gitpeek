/**
 * --projectPath="/Users/user/code" --day="2020-01-01" --author=user
 */

const { lstatSync, readdirSync } = require('fs');
const { join } = require('path');
const { exec } = require('child_process');
const args = require('yargs').argv;
const dayjs = require('dayjs');
const dlv = require('dlv');
const { dim, bold, yellow, magenta } = require('kleur');

const defaultSkippedDirectories = ['node_modules', 'public', '.git', '_scripts', 'app', 'vendor'];

function setTime(date, { time = 'morning' }) {
  return date
    .set('hour', time === 'morning' ? 0 : 23)
    .set('minute', time === 'morning' ? 0 : 59)
    .set('second', time === 'morning' ? 0 : 59);
}

const currentDate = dayjs();
const startDate = setTime(currentDate, { time: 'morning' });
const untilDate = setTime(currentDate, { time: 'night' });

const currentPath = __dirname;
const author = dlv(args, 'author', '$GIT_USER');
const projectPath = dlv(args, 'projectPath', __dirname);
const format = dlv(args, 'format', '%an <%ae> - %s');
const day = dlv(args, 'day', false);
let since = dlv(args, 'since', false);
let until = dlv(args, 'until', false);

since = since !== false ? setTime(dayjs(since), { time: 'morning' }) : startDate;
until = until !== false ? setTime(dayjs(until), { time: 'night' }) : untilDate;

if (day) {
  since = setTime(dayjs(day), { time: 'morning' });
  until = setTime(dayjs(day), { time: 'night' });
}

const skipDirectoriesArg = dlv(args, 'skipDirectories', false);

const skipDirectories = [
  ...(skipDirectoriesArg ? skipDirectoriesArg.split(',') : []),
  ...defaultSkippedDirectories,
];

const isDirectory = source => lstatSync(source).isDirectory();
const getDirectoriesInFolder = source =>
  readdirSync(source)
    .map(name => join(source, name))
    .filter(isDirectory);

const directories = getDirectoriesInFolder(projectPath);

console.log('\n');
getGitDirectory(directories);

function gitTimeFormat(date) {
  return date.format();
}

console.log(
  yellow(
    bold(
      `Getting git logs for ${since.format('DD-MM-YYYY')}${
      since.format('DD-MM-YYYY') !== until.format('DD-MM-YYYY')
        ? ` to ${until.format('DD-MM-YYYY')}`
        : ''
      }${author !== '$GIT_USER' ? author === 'false' ? ' from everyone' : ` from ${author}` : ''}`
    )
  )
);
console.log('\n');

function getGitDirectory(directories) {
  directories.forEach(directory => {
    if (directory.match(/\.git/)) {
      exec(
        `cd ${directory}; git log --date=local --since="${gitTimeFormat(
          since
        )}" --until="${gitTimeFormat(
          until
        )}" ${author === 'false' ? '--author=".*"' : `--author="${author}"`} --pretty=format:"${format}" --no-merges --reverse | cat`,
        (err, stdout, stderr) => {
          if (err) return;
          if (stdout === '') return;
          console.log(magenta(bold(dim(directory))));
          console.log(`${stdout}`);
          console.log('\n');
        }
      );
    }

    let directoryIsAllowed = true;
    skipDirectories.forEach(string => {
      if (new RegExp(string).test(directory) && directoryIsAllowed === true)
        directoryIsAllowed = false;
    });

    if (directoryIsAllowed === false) {
      return;
    }

    if (isDirectory(directory)) {
      const lowerDirectories = getDirectoriesInFolder(directory);
      getGitDirectory(lowerDirectories);
    }
  });
}
