// Mock for jest-expo preset when expo-modules-core/src/Refs is missing (e.g. after Expo upgrade)
module.exports = {
  createSnapshotFriendlyRef() {
    const ref = { current: null };
    Object.defineProperty(ref, 'toJSON', {
      value: () => '[React.ref]',
    });
    return ref;
  },
};
