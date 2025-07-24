// const { getDefaultConfig } = require("expo/metro-config");
// const { withNativeWind } = require("nativewind/metro");

// const config = getDefaultConfig(__dirname);

// // https://github.com/supabase/supabase-js/issues/1258#issuecomment-2801695478
// config.resolver = {
// 	...config.resolver,
// 	unstable_conditionNames: ["browser"],
// 	unstable_enablePackageExports: false,
// };

// module.exports = withNativeWind(config, { input: "./global.css" });

// const { getDefaultConfig } = require('metro-config');

// module.exports = (async () => {
//   const {
//     resolver: { sourceExts, assetExts },
//   } = await getDefaultConfig();
//   return {
//     transformer: {
//       babelTransformerPath: require.resolve('react-native-svg-transformer'),
//     },
//     resolver: {
//       assetExts: assetExts.filter(ext => ext !== 'svg'),
//       sourceExts: [...sourceExts, 'svg'],
//     },
//   };
// })();

const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

module.exports = (async () => {
  const config = getDefaultConfig(__dirname);

  // Preserve existing arrays
  const { assetExts, sourceExts } = config.resolver;

  // Add SVG support (remove svg from assetExts and add to sourceExts)
  config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');
  config.resolver.assetExts = assetExts.filter(ext => ext !== 'svg');
  config.resolver.sourceExts = [...sourceExts, 'svg'];

  // Your previous custom resolver tweaks (only if you really need them)
  config.resolver.unstable_conditionNames = ['browser'];
  config.resolver.unstable_enablePackageExports = false;

  // Wrap with NativeWind (must be last so it can adjust the transformer)
  return withNativeWind(config, { input: './global.css' });
})();
