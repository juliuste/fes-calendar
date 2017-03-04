'use strict'

const tape = require('tape')
const calendar = require('./index')

tape('fes-calendar', (t) => {
	calendar(new Date(), (+new Date)+10000000)
	.then((events) => {
		t.plan(6)
		t.false(events.length==0, 'results count')
		t.true(events[0].id, 'result id')
		t.true(events[0].title, 'result title')
		t.true(+new Date(events[0].date.start) > 0, 'result start')
		t.true(events[0].organization.id==='fes', 'result organization id')
		t.true(events[0].organization.name==='Friedrich-Ebert-Stiftung', 'result organization name')
	})
})