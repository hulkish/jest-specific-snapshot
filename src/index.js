/* eslint no-underscore-dangle: ["error", { "allow": ["_updateSnapshot"] }] */
import path from 'path';
import { SnapshotState, toMatchSnapshot, addSerializer } from 'jest-snapshot';

const snapshotsStateMap = new Map();
let commonSnapshotState;

function getAbsolutePathToSnapshot(testPath, snapshotFile) {
  return path.isAbsolute(snapshotFile)
    ? snapshotFile
    : path.resolve(path.dirname(testPath), snapshotFile);
}

afterAll(() => {
  snapshotsStateMap.forEach(snapshotState => {
    const uncheckedCount = snapshotState.getUncheckedCount();

    if (uncheckedCount) {
      snapshotState.removeUncheckedKeys();
    }

    snapshotState.save();

    if (commonSnapshotState) {
      // Update common state so we get the report right with added/update/unmatched snapshots.
      // Jest will display the "u" & "i" suggestion, plus displaying the right number of update/added/unmatched snapshots.
      commonSnapshotState.unmatched += snapshotState.unmatched;
      commonSnapshotState.matched += snapshotState.matched;
      commonSnapshotState.updated += snapshotState.updated;
      commonSnapshotState.added += snapshotState.added;
    }
  });
});

function toMatchSpecificSnapshot(received, snapshotFile, testName) {
  const absoluteSnapshotFile = getAbsolutePathToSnapshot(this.testPath, snapshotFile);

  // store the common state to re-use it in "afterAll" hook.
  commonSnapshotState = this.snapshotState;
  let snapshotState = snapshotsStateMap.get(absoluteSnapshotFile);

  if (!snapshotState) {
    snapshotState = new SnapshotState(absoluteSnapshotFile, {
      updateSnapshot: commonSnapshotState._updateSnapshot,
      snapshotPath: absoluteSnapshotFile,
    });
    snapshotsStateMap.set(absoluteSnapshotFile, snapshotState);
  }

  const newThis = Object.assign({}, this, { snapshotState });
  const patchedToMatchSnapshot = toMatchSnapshot.bind(newThis);

  return patchedToMatchSnapshot(received, testName);
}

expect.extend({ toMatchSpecificSnapshot });

export { addSerializer, toMatchSpecificSnapshot };
