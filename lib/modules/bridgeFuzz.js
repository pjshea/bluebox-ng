// Copyright Jesus Perez <jesusprubio gmail com>
//           Sergio Garcia <s3rgio.gr gmail com>
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

'use strict';

const SteroidsSocket = require('sip-fake-stack').SteroidsSocket;
const logger = require('../utils/logger');
const fuzzer = require('fuzzer');

module.exports.help = {
  description: 'Really stupid app layer fuzzer (support:' +
               'UDP, TCP, TLS, [secure] websockects)',
  options: {
    target: {
      type: 'ip',
      description: 'Host to attack',
      defaultValue: '127.0.0.1',
    },
    port: {
      type: 'port',
      description: 'Port to attack on chosen IPs',
      defaultValue: 443,
    },
    transport: {
      type: 'transports',
      description: 'Underlying protocol',
      defaultValue: 'WSS',
    },
    wsPath: {
      type: 'allValid',
      description: 'Websockets path (only when websockets)',
      defaultValue: 'ws',
    },
    wsProto: {
      type: 'allValid',
      description: 'Websockets sub protocol (only when websockets: i.e. sip, AVTP)',
      defaultValue: 'sip',
    },
    corpus: {
      type: 'allValid',
      description: 'Corpus to start with',
      defaultValue: 'Fuzzy wuzzy was a bear',
    },
    loops: {
      type: 'positiveInt',
      description: 'Number of times to send fuzzed data, number of loops.',
      defaultValue: 5000,
    },
    timeout: {
      type: 'positiveInt',
      description: 'Time to wait for a response, in ms.',
      defaultValue: 500,
    },
  },
};
let fuzzString = '';
let lastSent;
let megaSocket;


// Muting and sending the payload,
// we're doing it over the last mutated value
function send() {
  fuzzString = fuzzer.mutate.string(fuzzString);
  megaSocket.send(fuzzString);

  // The message which is being sent
  lastSent = fuzzString;

  // Omit printint to increase performance
  logger.infoHigh('Packet sent:');
  logger.highlight(fuzzString);
}


module.exports.run = (options, callback) => {
  const socketCfg = {
    target: options.target,
    port: options.port,
    transport: options.transport,
    wsProto: options.wsProto,
    timeout: options.timeout,
  };
  let answering = false;

  megaSocket = new SteroidsSocket(socketCfg);

  // We reuse the same socket for now
  megaSocket.on('error', err => {
    if (!answering) {
      callback(err);
      if (++loop != options.loops) {
        logger.highlight(loop);
        send();
      }
    } else {
      callback(null, {
        lastSent,
      });
      logger.info('Boom!, last packet sent:');
      logger.highlight(lastSent);
    }
  });

  // megaSocket.on('message', function (msg) {
  megaSocket.on('message', () => {
    answering = true;

    logger.info('Response received');

    // Server is still answering, so keep muting
    send();
  });

  fuzzer.seed(0);
  fuzzString = options.corpus;
  let loop = 0;

  // Sending initial request
  send();

};
