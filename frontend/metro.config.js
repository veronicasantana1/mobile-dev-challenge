const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = new Proxy(
  {},
  {
    get: (target, name) => {
      if (name === "@mobile-dev-challenge/shared") {
        return path.join(__dirname, "../shared");
      }
      return path.join(__dirname, "node_modules", name);
    },
  }
);
config.watchFolders = [
  ...(config.watchFolders || []),
  path.resolve(__dirname, "../shared"),
];

module.exports = config;
