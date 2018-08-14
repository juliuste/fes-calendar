'use strict'

const tape = require('tape')
const moment = require('moment-timezone')
const isDate = require('lodash.isdate')
const calendar = require('./index')

tape('fes-calendar', async t => {
	const start = moment.tz('Europe/Berlin').add(4, 'days').startOf('day').add(10, 'hours').toDate()
	const end = moment.tz('Europe/Berlin').add(6, 'days').startOf('day').add(10, 'hours').toDate()

	const events = await calendar(start, end)

	t.ok(Array.isArray(events) && events.length > 0, 'results count')
	t.ok(!!events.find(e => e.end), 'at least one event with end')

	for (let event of events) {
		t.ok(typeof event.id === 'string' && event.id.length > 0, 'result id')
		t.ok(typeof event.title === 'string' && event.title.length > 0, 'result title')

		t.ok(event.start && isDate(event.start), 'start')
		t.ok(+new Date('2000-01-01') < +event.start, 'event started in this century')

		if (event.end) {
			t.ok(isDate(event.end), 'end')
			t.ok(+event.start <= +event.end, 'start <= end')
		}

		t.ok(event.organization.id==='fes', 'result organization id')
		t.ok(event.organization.name==='Friedrich-Ebert-Stiftung', 'result organization name')
	}

	t.end()
})
