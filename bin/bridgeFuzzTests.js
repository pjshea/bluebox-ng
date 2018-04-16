#!/usr/bin/env node

// Copyright Jesus Perez <jesusprubio gmail com>
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

/* eslint-disable no-console */

'use strict';

const Bluebox = require('../');
const fuzzer = require('fuzzer');
const logger = require('../lib/utils/logger');

const bluebox = new Bluebox({});
//const moduleOptions = { srcHost: 'iface:eno1', target: '10.39.131.165', port: 443, transport: 'WSS', wsProto: 'sip',  timeout: 2000, loops: 10000};

//const moduleOptions = { srcHost: 'iface:eno1', target: '34.234.16.236', port: 443, transport: 'WSS', wsProto: 'http',  timeout: 2000, loops: 10000};

const moduleOptions = { srcHost: 'iface:eno1', target: '34.234.16.236', port: 443, transport: 'WSS', wsProto: 'sip',  timeout: 2000, loops: 10000};
bluebox.runModule('bridgeFuzz', moduleOptions, (err, result) => {
    logger.bold('\nRESULT:');
    if (!err) {
      if (!result || result.length === 0) {
        logger.highlight('No result');
      } else {
        logger.json(result);
      }
    } else {
      logger.error(`ERROR: run(): ${JSON.stringify(err)}`);
    }
    logger.regular('\n');
});
