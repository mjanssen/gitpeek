# Gitlogs
[![npm](https://img.shields.io/npm/v/gitlogs.svg)](http://npm.im/gitlogs)

A __fast__ way to recursively get gitlogs per project on your working station.

# Install

```
npm i -g gitlogs
```

# Usage

`gitlogs --projectPath="/Users/you/code" --since="11-01-2019" --author=marnix`

# Options

_Options are not required_

```
gitlogs
  --author > pass an author
  --since > pass a start date
  --until > pass a until date
  --projectPath > pass a project path, which will be used to search for git directories
  --skipDirectories > pass directory names which should be skipped
```

### Options defaults

`author` > If not passed, commits of all contributors are listed
`since` > If not passed, today (00:00) is used
`until` > If not passed, the current time is used
`projectPath` > If not passed, the current directory is used (__dirname)
`skipDirectories` > already included directories: `['node_modules', 'public', '.git', '_scripts', 'app', 'vendor']`

When passing the `--skipDirectories` argument, make sure to list it as following:

`gitlogs --projectPath="/Users/you/code" --skipDirectories=another-directory,and-this-one`

# Example result

# License

[MIT](https://oss.ninja/mit/mjanssen/)
