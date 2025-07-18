// expo.config.js
export default {
    name: "MGHapp",
    slug: "actipain-tracker",
    version: "1.0.0",
    ios: {
      bundleIdentifier: "com.ninjaprime.MGHapp",
    },
    plugins: [
      [
        "expo-build-properties",
        {
          ios: {
            deploymentTarget: "15.1",
          },
        },
      ],
    ],
  };
  