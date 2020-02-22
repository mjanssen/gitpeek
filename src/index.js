#!/usr/bin/env node

/**
 * Import vendor modules
 */
const program = require('commander');

/**
 * Import own modules
 */
const packageJson = require('../package.json');

/**
 * Launches the app
 */
const run = async () => {
  /**
   * Set application name
   */
  program.name('gitlogger');

  /**
   * Set program version
   */
  program.version(packageJson.version);

  /**
   * Set program options
   */
  program
    .option('--current-user', 'use the current GIT user as author', false)
    .option('--author <author>', 'pass an author', false)
    .option('--day <YYYY-MM-DD>', 'pass a date of a specific day', false)
    .option('--since <YYYY-MM-DD>', 'pass a start date', false)
    .option('--until <YYYY-MM-DD>', 'pass a until date', false)
    .option('--format <format>', 'formats the git output (default is "%an <%ae> - %s"', '%an <%ae> - %s')
    .option('--project-path <path>', 'pass a project path, which will be used to search for git directories', __dirname)
    .option('--skip-directories <string>', 'pass directory names which should be skipped', null)
    .option('--json', 'give a json response', false);

  /**
   * Let commander handle process arguments
   */
  program.parse(process.argv);

  /**
   * Run the gitlogs program
   */
  require('./program')(program, false, true);
};

/**
 * Run the app
 */
run();
