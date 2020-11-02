const path = require("path");
const webpack = require("webpack");
const { shimFile } = require("./scripts/shim");
const resolvePath = (relativePath) => path.resolve(__dirname, relativePath);

shimFile(
  resolvePath(
    "./node_modules/react-native-reanimated/src/reanimated2/NativeReanimated.js"
  ),
  [
    {
      replace: 1,
      value: "import { Platform } from 'react-native';",
    },
    {
      replace: 8,
      value:
        "      require('react-native').TurboModuleRegistry.getEnforcing('NativeReanimated');",
    },
  ]
);

shimFile(
  resolvePath(
    "./node_modules/react-native-reanimated/src/createAnimatedComponent.js"
  ),
  [
    {
      replace: 13,
      value: "",
    },
    {
      toEnd: true,
      value: `function setAndForwardRef({ getForwardedRef, setLocalRef }) {
        return function forwardRef(ref) {
          const forwardedRef = getForwardedRef();
      
          setLocalRef(ref);
      
          // Forward to user ref prop (if one has been specified)
          if (typeof forwardedRef === 'function') {
            // Handle function-based refs. String-based refs are handled as functions.
            forwardedRef(ref);
          } else if (typeof forwardedRef === 'object' && forwardedRef != null) {
            // Handle createRef-based refs
            forwardedRef.current = ref;
          }
        };
      }`,
    },
  ]
);

shimFile(
  resolvePath(
    "./node_modules/react-scripts/scripts/utils/verifyTypeScriptSetup.js"
  ),
  [
    {
      from: 148,
      to: 158,
      value: "",
    },
  ]
);
const srcIncludes = [
  // resolvePath('src'),
  resolvePath("./src"),
];
// const appDirectory = fs.realpathSync(process.cwd())
// our packages that will now be included in the CRA build step
const appIncludes = [
  ...srcIncludes,
  resolvePath("./node_modules/react-native-animatable"),
  resolvePath("./node_modules/react-native-reanimated"),
  resolvePath("./node_modules/react-native-redash"),
  resolvePath("./node_modules/react-native-gesture-handler"),
];

module.exports = function override(config, env) {
  const __DEV__ = env !== "production";

  // allow importing from outside of src folder
  config.resolve.plugins = config.resolve.plugins.filter(
    (plugin) => plugin.constructor.name !== "ModuleScopePlugin"
  );

  config.module.rules[0].include = appIncludes;

  config.module.rules[1].oneOf[2].include = appIncludes;
  config.module.rules[1].oneOf[2].options.plugins = [
    "react-native-reanimated/plugin",
  ].concat(config.module.rules[1].oneOf[2].options.plugins);
  config.module.rules = config.module.rules.filter(Boolean);

  config.plugins.push(new webpack.DefinePlugin({ __DEV__ }));
  return config;
};
