const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);

// expo-sqlite web support: treat .wasm as an asset so Metro can resolve it
config.resolver.assetExts = [...(config.resolver.assetExts || []), "wasm"];
// Also ensure wasm is not in sourceExts (Metro tries source first)
config.resolver.sourceExts = (config.resolver.sourceExts || []).filter(
  (ext) => ext !== "wasm"
);

module.exports = withNativeWind(config, { input: "./global.css" });