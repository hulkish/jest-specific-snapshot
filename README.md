# Jest Specific Snapshot #

TBD

# Installation #

```sh
npm i -D jest-specific-snapshot 
```

# Example #

```js
const path = require('path');
// extend jest to have 'toMatchSpecificSnapshot' matcher
require('jest-specifics-snapshot');

test('test', () => {
  // provides snapshot file with absolute file
  const pathToSnap = path.resolve(process.cwd(), './example/specific/dir/my.shot');
  expect(100).toMatchSpecificSnapshot(pathToSnap);

  //same snapshot but with relative file
  expect(14).toMatchSpecificSnapshot('./specific/dir/my.shot');

  // another snapshot file in the same test
  expect(19).toMatchSpecificSnapshot('./specific/another_dir/another.shot');
});
```

# Limitations # 

1. Snapshot files should have an extension **other** than `.snap`, since it conflicts with jest.
2. In order to handle the `--updateSnapshot` (`-u`) parameter provided from CLI, there is an abuse of the `SnapshotState._updateSnapshot` private field. TBD - try to use the `globalConfig` to get this state. 
3. TBD