/* eslint-disable valid-jsdoc */
const { createDefaultConfig } = require('@open-wc/testing-karma');

const merge = require('deepmerge');

/**
 * @param  {import('@types/karma').Config} config
 * @return  {import('@types/karma').Config}
 */
module.exports = config => {
  config.set(merge(createDefaultConfig(config), {
    ...config.autoWatch ? { mochaReporter: { output: 'autowatch' } } : {},
    files: [
      { pattern: config.grep ? config.grep : '*.test.js', type: 'module' },
    ],
    esm: {
      nodeResolve: true,
      coverageExclude: [
        '*.test.js',
        '*-lazy-image.js',
        'node_modules'
      ],
    }
  }));
  return config;
};
