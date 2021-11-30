const { EleventyServerlessBundlerPlugin } = require('@11ty/eleventy');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('static');

  eleventyConfig.addPlugin(EleventyServerlessBundlerPlugin, {
    name: 'thanks',
    functionsDir: './netlify/functions/',
    redirects: 'netlify-toml',
  });
};
