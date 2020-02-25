# gitpeek
[![npm](https://img.shields.io/npm/v/gitpeek.svg)](http://npm.im/gitpeek)

A __fast__ and easy way to recursively show gitlogs per project on your working station.

# Install

Globally
```
npm i -g gitpeek
```

or

Locally
```
npm i gitpeek
```

# Usage

`gitpeek --projectPath="/Users/you/code" --since="2020-02-17" --author=marnix`

```
const gitpeek = require('gitpeek');
gitpeek({ projectPath: '/Users/user/code', since: '2020-02-17' }).then(data => {
  console.log('data', data);
});
```

# Options

```
gitpeek in terminal

  --current-user               use the current GIT user as author (default: false)
  --author <author>            pass an author (default: false)
  --day <YYYY-MM-DD>           pass a date of a specific day (default: false)
  --since <YYYY-MM-DD>         pass a start date (default: false)
  --until <YYYY-MM-DD>         pass a until date (default: false)
  --format <format>            formats the git output (default is "%an <%ae> - %s" (default: "%an <%ae> - %s")
  --project-path <path>        pass a project path, which will be used to search for git directories (default: __dirname)
  --skip-directories <string>  pass directory names which should be skipped (default: null)
  --json                       give a json response
```

```
gitpeek in node

gitpeek({
  currentUser: false,
  author: false,
  day: false,
  since: false,
  until: false,
  format: '%an <%ae> - %s',
  projectPath: __dirname,
  skipDirectories: null,
  json: true,
}).then(result => console.log('result', result));
```

### Options defaults

`author` > If not passed, commits of all contributors are listed
`since` > If not passed, today (00:00) is used
`until` > If not passed, the current time is used
`format` > If not passed '%an <%ae> - %s' is used
`projectPath` > If not passed, the current directory is used (__dirname)
`skipDirectories` > already included directories: `['node_modules', 'public', '.git', '_scripts', 'app', 'vendor']`

When passing the `--skipDirectories` argument, make sure to pass it as a string, separating directories with a comma (,).
eg. `showgitlogs --projectPath="/Users/you/code" --skipDirectories=".next,.cache"`

# Output formatting
By default, the default formatting outputs `author <author email> - commit message` (). You can pass your own formatting
by passing `--format="<format>"` to the script. Formatting options can be found here https://git-scm.com/docs/pretty-formats.

# Example result

```
Getting git logs for 17-02-2020 from mjanssen

/Users/marnix/code/projects/some-awesome-project/.git
mjanssen <dev.marnix@gmail.com> - Render correct items for language
mjanssen <dev.marnix@gmail.com> - Update zindex for social icons
```

# License

[MIT](https://oss.ninja/mit/mjanssen/)
