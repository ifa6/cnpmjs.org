/**!
 * cnpmjs.org - controllers/web/package/search.js
 *
 * Copyright(c) cnpmjs.org and other contributors.
 * MIT Licensed
 *
 * Authors:
 *  dead_horse <dead_horse@qq.com> (http://deadhorse.me)
 *  fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 */

'use strict';

/**
 * Module dependencies.
 */

var debug = require('debug')('cnpmjs.org:controllers:web:package:search');
var packageService = require('../../../services/package');

module.exports = function* search() {
  var params = this.params;
  var word = params.word || params[0];
  debug('search %j', word);
  var result = yield* packageService.search(word);

  var match = null;
  for (var i = 0; i < result.searchMatchs.length; i++) {
    var p = result.searchMatchs[i];
    if (p.name === word) {
      match = p;
      break;
    }
  }

  // return a json result
  if (this.query && this.query.type === 'json') {
    this.body = {
      keyword: word,
      match: match,
      packages: result.searchMatchs,
      keywords: result.keywordMatchs,
    };
    this.type = 'application/json; charset=utf-8';
    return;
  }
  yield this.render('search', {
    title: 'Keyword - ' + word,
    keyword: word,
    match: match,
    packages: result.searchMatchs,
    keywords: result.keywordMatchs,
  });
};
