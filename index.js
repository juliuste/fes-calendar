'use strict'

const request = require('got')
const moment = require('moment-timezone')
const parser = require('cheerio')
const markdown = require('to-markdown')
const decodeHTML = require('he').decode
const iconv = require('iconv-lite')
const filter = require('lodash.filter')

const decodeISO = (iso) => iconv.decode(iso, 'ISO-8859-15')


const mergeDateTime = (date, time) => {
	if(!date) return null
	if(time) return moment.tz(`${date} ${time}`, 'DD.MM.YYYY HH:mm', 'Europe/Berlin').toISOString()
	return moment.tz(date, 'DD.MM.YYYY', 'Europe/Berlin').toISOString()
}

const mergeDateTimes = (event) => {
	if(!event.date){
		delete event.date
		delete event.time
		return event
	}
	if(!event.time) event.time = {start: null, end: null}
	const date = {
		start: mergeDateTime(event.date.start, event.time.start),
		end: mergeDateTime(event.date.end, event.time.end)
	}
	delete event.time
	event.date = date
	return event
}

const mergeAttachments = (event) => {
	if(!event.attachments) delete event.attachments
	if(event.attachments && event.registration) event.attachments = `${event.registration}\n${event.attachments}`
	else if(event.attachments || event.registration) event.attachments = event.attachments || event.registration
	delete event.registration
	return event
}

const parseText = ($) => markdown(decodeHTML($.children().last().html()))
const parseTitle = ($) => ({'id': decodeHTML($.children().last().text()).slice(0, 6), 'title': decodeHTML($.children().last().html()).slice(7)})
const parseDate = ($) => {
	const result = decodeHTML($.children().last().text())
	.split(' bis ')
	.map((s) => s.slice(-8))
	if(!result[0]) return {start: null, end: null}
	else if(result.length===1) return {start: result[0], end: null}
	else if(result.length===2) return {start: result[0], end: result[1]}
}
const parseTime = ($) => {
	const result = decodeHTML($.children().last().text())
	.split(' bis ')
	.map((s) => s.slice(0, 5))
	if(!result[0]) return {start: null, end: null}
	else if(result.length===1) return {start: result[0], end: null}
	else if(result.length===2) return {start: result[0], end: result[1]}
}
const parseMail = ($) => (decodeHTML($.children().last().children('a').first().text()) || null)
const parseFee = ($) => +decodeHTML($.children().last().text()).split(',').map((s) => s.replace(/\D/g, '')).join('.')
const parseAttachments = ($) => markdown(decodeHTML($.children().last().html())) || null
const parseChildcare = ($) => (decodeHTML($.children().last().text()) === 'ja') ? true : false

const parseRow = ($) => {
	if($.children().first().attr('class')==='a') return {'registration': parseAttachments($)}
	switch($.children().first().text()){
		case 'Titel der Veranstaltung': return parseTitle($)
		case 'Beschreibung': return {'description': parseText($)}
		case 'Ansprechpartn.': return {'contact-person': parseText($)}
		case 'Termin:': return {'date': parseDate($)}
		case 'Uhrzeit:': return {'time': parseTime($)}
		case 'Veranstaltungsort': return {'location': parseText($)}
		case 'Kontaktanschrift': return {'contact-address': parseText($)}
		case 'e-Mail': return {'mail': parseMail($)}
		case 'Teilnehmerpauschale': return {'fee': parseFee($)}
		case 'Wichtiger Hinweis:': return {'info': parseText($)}
		case 'Material:': return {'attachments': parseAttachments($)}
		case 'Kinderbetreuung': return {'childcare': parseChildcare($)}
		// case 'Bild': return {'image': parseImage($)}
		default: return {}
	}
}

const parseEvent = ($) => {
	let event = {}
	for(let row of Array.from($.children())) event = Object.assign(event, parseRow(parser(row)))
	return mergeAttachments(mergeDateTimes(event))
}

const splitEvents = ($) => Array.from($('table')).map(parser)

const fetch = (start, end) => {
	return request.post('http://www.fes.de/t3php/vera_nform.php', {
		query: {
			p_ive_datum1: moment(start).format('DD.MM.YYYY'),
			p_ive_datum2: moment(end).format('DD.MM.YYYY')
		},
		encoding: null
	})
	.then((result) => result.body)
	.then(decodeISO)
	.then(parser.load)
	.then(splitEvents)
	.then((events) => events.map(parseEvent))
	.then((events) => filter(events, (o) => o && o.id)
		.map((s) => {s.organization = ({name: 'Friedrich-Ebert-Stiftung', id: 'fes'}); return s}))
}

module.exports = fetch