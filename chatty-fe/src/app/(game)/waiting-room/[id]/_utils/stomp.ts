'use client';

import * as StompJs from '@stomp/stompjs';

const client = new StompJs.Client({
  brokerURL: 'ws://localhost:8080/api/ws',
  debug: function (str) {
    console.log(str);
  },
  reconnectDelay: 5000,
  heartbeatIncoming: 4000,
  heartbeatOutgoing: 4000,
});

export default client;
