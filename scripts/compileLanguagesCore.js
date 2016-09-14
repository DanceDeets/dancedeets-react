/**
 * Copyright 2016 DanceDeets.
 *
 * @flow
 */

'use strict';

import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';
import clone from 'git-clone';
import {sync as mkdirpSync} from 'mkdirp';

function writeFile(filename, contents) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, contents, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(path.resolve(filename));
      }
    });
  });
}

const REPO_PATH = 'build/country-list';

const locales = ['en', 'fr', 'zh_Hans', 'zh_Hant', 'ja', 'de', 'it', 'nl', 'ru', 'ko', 'es'];

function downloadCountryList(cb) {
  mkdirpSync('build');
  clone('https://github.com/umpirsky/country-list.git', REPO_PATH, {shallow: true}, cb);
}

function getLocaleFrom(filename) {
  const components = filename.split('/');
  return components[components.length - 2];
}

function combineCountryList(filter, cb) {
  const combined = glob.sync(`${REPO_PATH}/data/*/country.json`)
    .filter((filename) => {
      const locale = getLocaleFrom(filename);
      return filter(locale);
    })
    .reduce((reduced, filename) => {
      const locale = getLocaleFrom(filename);
      // $FlowFixMe: This is a dev script, and so can use dynamic includes
      const data = require(`../${filename}`);
      reduced[locale] = data;
      return reduced;
    }, {});

  cb(combined);
}

function languageFilter(locale) {
  return locales.indexOf(locale) !== -1;
}

function saveCombinedList(combined) {
  let fileData = 'export default ';
  fileData += JSON.stringify(combined);
  mkdirpSync('js/data');
  writeFile('js/data/localizedCountries.js', fileData).then(() => null);
}

downloadCountryList(combineCountryList(languageFilter, saveCombinedList));
