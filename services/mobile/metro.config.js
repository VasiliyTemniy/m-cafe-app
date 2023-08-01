// const path = require("path");
// module.exports = (__dirname) => {
//   // Live refresh when any of our packages are rebuilt
//   const packagesWorkspace = path.resolve(
//     path.join(__dirname, "../../packages")
//   );
//   const watchFolders = [packagesWorkspace];
//   const nodeModulesPaths = [
//     path.resolve(path.join(__dirname, "../../node_modules")),
//   ];
//   return {
//     transformer: {
//       getTransformOptions: async () => ({
//         transform: {
//           experimentalImportSupport: true,
//           inlineRequires: true,
//         },
//       }),
//     },
//     resolver: {
//       // "Please use our `node_modules` instance of these packages"
//       resolveRequest: (context, moduleName, platform) => {
//         if (
//           // Add to this list whenever a new React-reliant dependency is added
//           moduleName.startsWith("react") ||
//           moduleName.startsWith("@react-native") ||
//           moduleName.startsWith("@react-native-community") ||
//           moduleName.startsWith("@your-org")
//         ) {
//           const pathToResolve = path.resolve(
//             __dirname,
//             "node_modules",
//             moduleName
//           );
//           return context.resolveRequest(context, pathToResolve, platform);
//         }
//         // Optionally, chain to the standard Metro resolver.
//         return context.resolveRequest(context, moduleName, platform);
//       },
//       nodeModulesPaths,
//     },
//     watchFolders,
//   };
// };