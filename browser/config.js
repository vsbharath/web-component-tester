/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt The complete set of authors may be found
 * at http://polymer.github.io/AUTHORS.txt The complete set of contributors may
 * be found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by
 * Google as part of the polymer project is also subject to an additional IP
 * rights grant found at http://polymer.github.io/PATENTS.txt
 */
import ChildRunner from './childrunner.js';
import * as util from './util.js';
/**
 * The global configuration state for WCT's browser client.
 */
export var _config = {
    environmentScripts: !!window.__wctUseNpm ?
        [
            'stacky/browser.js',
            'async/lib/async.js',
            'lodash/index.js',
            'mocha/mocha.js',
            'chai/chai.js',
            '@polymer/sinonjs/sinon.js',
            'sinon-chai/lib/sinon-chai.js',
            'accessibility-developer-tools/dist/js/axs_testing.js',
            '@polymer/test-fixture/test-fixture.js'
        ] :
        [
            'stacky/browser.js',
            'async/lib/async.js',
            'lodash/lodash.js',
            'mocha/mocha.js',
            'chai/chai.js',
            'sinonjs/sinon.js',
            'sinon-chai/lib/sinon-chai.js',
            'accessibility-developer-tools/dist/js/axs_testing.js'
        ],
    environmentImports: !!window.__wctUseNpm ? [] :
        ['test-fixture/test-fixture.html'],
    root: null,
    waitForFrameworks: true,
    waitFor: null,
    numConcurrentSuites: 1,
    trackConsoleError: true,
    mochaOptions: { timeout: 10 * 1000 },
    verbose: false,
};
/**
 * Merges initial `options` into WCT's global configuration.
 *
 * @param {Object} options The options to merge. See `browser/config.ts` for a
 *     reference.
 */
export function setup(options) {
    var childRunner = ChildRunner.current();
    if (childRunner) {
        _deepMerge(_config, childRunner.parentScope.WCT._config);
        // But do not force the mocha UI
        delete _config.mochaOptions.ui;
    }
    if (options && typeof options === 'object') {
        _deepMerge(_config, options);
    }
    if (!_config.root) {
        // Sibling dependencies.
        var root = util.scriptPrefix('browser.js');
        _config.root = util.basePath(root.substr(0, root.length - 1));
        if (!_config.root) {
            throw new Error('Unable to detect root URL for WCT sources. Please set WCT.root before including browser.js');
        }
    }
}
/**
 * Retrieves a configuration value.
 */
export function get(key) {
    return _config[key];
}
// Internal
function _deepMerge(target, source) {
    Object.keys(source).forEach(function (key) {
        if (target[key] !== null && typeof target[key] === 'object' &&
            !Array.isArray(target[key])) {
            _deepMerge(target[key], source[key]);
        }
        else {
            target[key] = source[key];
        }
    });
}
