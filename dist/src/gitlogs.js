const { lstatSync, readdirSync } = require('fs');
const { join } = require('path');
const { exec } = require('child_process');
const args = require('yargs').argv;
const dayjs = require('dayjs');
const dlv = require('dlv');
const { cyan, bold, dim } = require('kleur');

const defaultSkippedDirectories = ['node_modules', 'public', '.git', '_scripts', 'app', 'vendor'];

const currentDate = dayjs();
const startDate = currentDate
  .set('hour', 0)
  .set('minute', 0)
  .set('second', 0)
  .format();

const currentPath = __dirname;

const author = dlv(args, 'author', '$GIT_USER');
const since = dlv(args, 'since', startDate);
const until = dlv(args, 'until', currentDate.format());
const projectPath = dlv(args, 'projectPath', __dirname);

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

function getGitDirectory(directories) {
  directories.forEach(directory => {
    if (directory.match(/\.git/)) {
      exec(
        `cd ${directory}; git log --since=${since} --until="${until}" --author="${author}" --pretty=format:%s --no-merges --reverse | cat`,
        (err, stdout, stderr) => {
          if (err) return;
          if (stdout === '') return;
          console.log(cyan(bold(directory)));
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
