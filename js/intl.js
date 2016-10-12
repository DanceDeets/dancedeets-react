/**
 * Copyright 2016 DanceDeets.
 *
 * @flow
 */

'use strict';

import React from 'react';
import { addLocaleData, IntlProvider } from 'react-intl';
import Locale from 'react-native-locale';
import areIntlLocalesSupported from 'intl-locales-supported';
import moment from 'moment';

const defaultLocale = 'en';
const locales = ['en', 'ja', 'fr', 'zh-Hant'];

import 'moment/locale/fr';
import 'moment/locale/ja';
import 'moment/locale/zh-tw';
import fr from './messages/fr.json';
import ja from './messages/ja.json';
import zh from './messages/zh.json';


const messages = {
  en: null, // use built-ins...but ensure we have an entry so we don't have undefined flow errors
  fr,
  ja,
  'zh-Hant': zh,
};

// https://github.com/yahoo/intl-locales-supported#usage
if (global.Intl) {
  // Determine if the built-in `Intl` has the locale data we need.
  if (!areIntlLocalesSupported(locales)) {
    // `Intl` exists, but it doesn't have the data we need, so load the
    // polyfill and replace the constructors we need with the polyfill's.
    require('intl');
    global.Intl.NumberFormat = global.IntlPolyfill.NumberFormat; // eslint-disable-line no-undef
    global.Intl.DateTimeFormat = global.IntlPolyfill.DateTimeFormat; // eslint-disable-line no-undef
  }
} else {
  // No `Intl`, so use and load the polyfill.
  global.Intl = require('intl');
}

// Only load these if we're using the polyfill (that exposes this function)
if (global.Intl.__addLocaleData) {
  // These have number formtting, useful for NumberFormat and DateTimeFormat
  require('intl/locale-data/jsonp/en');
  require('intl/locale-data/jsonp/fr');
  require('intl/locale-data/jsonp/ja');
  require('intl/locale-data/jsonp/zh');
}

// These has pluralRuleFunction, necessary for react-intl's use of intl-messageformat
addLocaleData(require('react-intl/locale-data/en'));
addLocaleData(require('react-intl/locale-data/fr'));
addLocaleData(require('react-intl/locale-data/ja'));
addLocaleData(require('react-intl/locale-data/zh'));

const getCurrentLocale = () => {
  const currentLocale = Locale.constants().localeIdentifier.split('_')[0];
  return locales.indexOf(currentLocale) !== -1
    ? currentLocale
    : defaultLocale;
};

function configureMoment(currentLocale) {
  // Our Locale.contstants().localeIdentifier returns zh-Hant_US.
  // But moment locales are zh-tw (traditional) and zh-cn (simplified).
  // So manually convert the getCurrentLocale() 'zh' to the 'zh-tw' moment needs:
  let momentLocale = currentLocale;
  if (momentLocale === 'zh-Hant') {
    momentLocale = 'zh-tw';
  }
  moment.locale(momentLocale);
}

export function constructIntl() {
  let currentLocale = getCurrentLocale();
  configureMoment(currentLocale);
  return new IntlProvider({
    defaultLocale: defaultLocale,
    key: currentLocale, // https://github.com/yahoo/react-intl/issues/234
    locale: currentLocale,
    messages: messages[currentLocale],
  }, {
  }).getChildContext().intl;
}

export function intl(Wrapped: any) {
  class Internationalize extends React.Component {

    render() {
      let currentLocale = getCurrentLocale();
      configureMoment(currentLocale);
      return (
        <IntlProvider
          defaultLocale={defaultLocale}
          key={currentLocale} // https://github.com/yahoo/react-intl/issues/234
          locale={currentLocale}
          messages={messages[currentLocale]}
        >
          <Wrapped {...this.props} />
        </IntlProvider>
      );
    }

  }

  return Internationalize;
}
