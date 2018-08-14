# fes-calendar

Queries the [Friedrich-Ebert-Stiftung (FES) event calendar](http://www.fes.de/de/veranstaltungen/) website for events.

[![npm version](https://img.shields.io/npm/v/fes-calendar.svg)](https://www.npmjs.com/package/fes-calendar)
[![Build Status](https://travis-ci.org/juliuste/fes-calendar.svg?branch=master)](https://travis-ci.org/juliuste/fes-calendar)
[![Greenkeeper badge](https://badges.greenkeeper.io/juliuste/fes-calendar.svg)](https://greenkeeper.io/)
[![dependency status](https://img.shields.io/david/juliuste/fes-calendar.svg)](https://david-dm.org/juliuste/fes-calendar)
[![license](https://img.shields.io/github/license/juliuste/fes-calendar.svg?style=flat)](license)
[![chat on gitter](https://badges.gitter.im/juliuste.svg)](https://gitter.im/juliuste)

## Installation

```js
npm install fes-calendar
```

## Usage

```js
const calendar = require('fes-calendar')

const events = calendar(startDate, endDate).then(…)
```

Returns a Returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/promise) that resolves in a list of events in the time period between given `startDate` and `endDate` (required). All texts are markdown-formatted.

```js
{
	id: '212212',
	title: 'Politik um 12',
	description: 'This is a description text.',
	mail: 'paula.blub@fis.di',
	'contact-person': 'Peter Testperson',
	'contact-address': 'FIS NRW, Charles Place 22, 44444 Borsteln',
	start: '2017-06-30T18:00:00.000Z',
	end: '2017-06-31T09:00:00.000Z' // optional
	location: 'Blubdorf',
	fee: 0, // in EUR
	info: 'keine Plätze mehr',
	childcare: false,
	attachments: '[FE6_www.pdf](https://www.fis.di/oas6_www.pdf)\n[FGHS](https://www.fis.di/oblunk.pdf)',
	organization: {
		name: 'Friedrich-Ebert-Stiftung',
		id: 'fes'
	}
}
// …
```

## Contributing

If you found a bug or want to propose a feature, feel free to visit [the issues page](https://github.com/juliuste/fes-calendar/issues).
