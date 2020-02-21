# Showgitlogs
[![npm](https://img.shields.io/npm/v/showgitlogs.svg)](http://npm.im/showgitlogs)

A __fast__ way to recursively show gitlogs per project on your working station.

# Install

```
npm i -g showgitlogs
```

# Usage

`showgitlogs --projectPath="/Users/you/code" --since="11-01-2019" --author=marnix`

# Options

_Options are not required_

```
showgitlogs
  --author > pass an author
  --since > pass a start date
  --until > pass a until date
  --format > formats the git output (default is '%an <%ae> - %s')
  --projectPath > pass a project path, which will be used to search for git directories
  --skipDirectories > pass directory names which should be skipped
```

### Options defaults

`author` > If not passed, commits of all contributors are listed
`since` > If not passed, today (00:00) is used
`until` > If not passed, the current time is used
`format` > If not passed '%an <%ae> - %s' is used
`projectPath` > If not passed, the current directory is used (__dirname)
`skipDirectories` > already included directories: `['node_modules', 'public', '.git', '_scripts', 'app', 'vendor']`

When passing the `--skipDirectories` argument, make sure to list it as following:

`showgitlogs --projectPath="/Users/you/code" --skipDirectories=another-directory,and-this-one`

# Output formatting
By default, the default formatting outputs `author <author email> - commit message` (). You can pass your own formatting
by passing `--format="<format>"` to the script. Formatting options can be found here https://git-scm.com/docs/pretty-formats.

# Example result

```
/Users/marnix/code/projects/some-awesome-project/.git
mjanssen <dev.marnix@gmail.com> - Render correct items for language
mjanssen <dev.marnix@gmail.com> - Update zindex for social icons
```

# License

[MIT](https://oss.ninja/mit/mjanssen/)
