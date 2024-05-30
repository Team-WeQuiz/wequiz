'use client';

import * as StompJs from '@stomp/stompjs';

const stompClient = new StompJs.Client({
  brokerURL: 'ws://api.wequiz.kr/ws',
  debug: function (str) {
    console.log(str);
  },
  reconnectDelay: 5000,
  heartbeatIncoming: 4000,
  heartbeatOutgoing: 4000,
});

export default stompClient;
