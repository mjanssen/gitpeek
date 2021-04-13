const { lstatSync, readdirSync } = require('fs');
const util = require('util');
const { join } = require('path');
const exec = util.promisify(require('child_process').exec);
const dayjs = require('dayjs');
const dlv = require('dlv');
const { dim, bold, yellow, magenta } = require('kleur');

let skipDirectories = ['node_modules', 'public', '.git', '_scripts', 'app', 'vendor'];
let currentUser,
  author,
  projectPath,
  format,
  day,
  since,
  until,
  _jsonResponse = true;

const result = {
  directories: [],
  entries: [],
};

function setTime(date, { time = 'morning' }) {
  return date
    .set('hour', time === 'morning' ? 0 : 23)
    .set('minute', time === 'morning' ? 0 : 59)
    .set('second', time === 'morning' ? 0 : 59);
}

function isDirectory(source) {
  return lstatSync(source).isDirectory();
}

function getDirectoriesInFolder(source) {
  return readdirSync(source)
    .map((name) => join(source, name))
    .filter(isDirectory);
}

function gitTimeFormat(date) {
  return date.format();
}

let counts = [0, 0];

async function getGitDirectory(directories, callback = () => {}) {
  for (let i = 0; i < directories.length; i += 1) {
    const directory = directories[i];
    if (directory.match(/\.git/)) {
      counts[0] += 1;
      const { stdout, stderr } = await exec(
        `cd ${directory}; git log --date=local --since="${gitTimeFormat(
          since
        )}" --until="${gitTimeFormat(until)}" --name-status ${
          author === false
            ? '--author=".*"'
            : `--author=${currentUser ? '$(git config user.name)' : author}`
        } --pretty=format:"${format}" --no-merges --reverse | cat`
      );

      const isValid = !stderr && stdout !== '';
      counts[1] += 1;

      if (_jsonResponse && isValid) {
        result.directories.push(directory);
        result.entries.push(
          ...stdout
            .split('\n\n')
            .map((output) => {
              const newLineSplit = output.split('\n');
              const commit = newLineSplit[0];
              const files = output.match(/\t(.*)/gi);

              return {
                output,
                commit,
                directory,
                files: files ? files.map((lines) => lines.trim()) : [],
              };
            })
            .filter((e) => e.commit)
        );
      }

      if (_jsonResponse === false && isValid) {
        console.log(magenta(bold(dim(directory))));
        console.log(`${stdout}`);
        console.log('\n');
      }

      if (counts[0] === counts[1]) {
        return callback();
      }
    }

    if (directory.match(/\.git/) === null) {
      let directoryIsAllowed = true;
      skipDirectories.forEach((string) => {
        if (new RegExp(string).test(directory) && directoryIsAllowed === true)
          directoryIsAllowed = false;
      });

      if (directoryIsAllowed && isDirectory(directory)) {
        const lowerDirectories = getDirectoriesInFolder(directory);
        if (lowerDirectories.length > 0) {
          getGitDirectory(lowerDirectories, callback);
        }
      }
    }
  }
}

async function program(program = {}, jsonResponse = true, cli = false) {
  _jsonResponse = program.json || jsonResponse;

  const currentDate = dayjs();
  const startDate = setTime(currentDate, { time: 'morning' });
  const untilDate = setTime(currentDate, { time: 'night' });

  const authorUndefined = typeof program.author === 'undefined';

  currentUser = program.currentUser || authorUndefined;
  author = currentUser ? 'current user' : program.author;

  projectPath = dlv(program, 'projectPath', __dirname);
  format = dlv(program, 'format', '%an <%ae> - %s');
  day = program.day;
  since = program.since;
  until = program.until;

  since = since !== false ? setTime(dayjs(since), { time: 'morning' }) : startDate;
  until = until !== false ? setTime(dayjs(until), { time: 'night' }) : untilDate;

  if (day) {
    since = setTime(dayjs(day), { time: 'morning' });
    until = setTime(dayjs(day), { time: 'night' });
  }

  const skipDirectoriesArg = dlv(program, 'skipDirectories', null);

  skipDirectories = [
    ...(skipDirectoriesArg ? skipDirectoriesArg.split(',') : []),
    ...skipDirectories,
  ];

  const directories = getDirectoriesInFolder(projectPath);

  console.log('\n');

  console.log(
    yellow(
      bold(
        `Getting git logs for ${since.format('DD-MM-YYYY')}${
          since.format('DD-MM-YYYY') !== until.format('DD-MM-YYYY')
            ? ` to ${until.format('DD-MM-YYYY')}`
            : ''
        }${author === false ? '' : ` from ${author}`}`
      )
    )
  );

  console.log('\n');

  if (_jsonResponse === false) return getGitDirectory(directories);

  return new Promise((resolve) => {
    getGitDirectory(directories, () => {
      if (cli) console.log(result);

      return resolve(result);
    });
  });
}

module.exports = program;
