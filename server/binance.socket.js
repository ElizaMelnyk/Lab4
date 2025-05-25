const WebSocket = require('ws');
const EventEmitter = require('events');
const generateProtobuf = require('./create-pb.util');

class BinanceTradeSocket extends EventEmitter {
  constructor() {
    super();
    this.ws = null;
    generateProtobuf.generateProtobuf();
    const trade = require('./generated/trade_pb');
    this.Trade =  trade.Trade.Trade;
  }

  async connect() {
    if (!this.Trade) {
      await this.loadProto();
    }

    if (!this.Trade) {
      return;
    }

    const streams = ['btcusdt', 'ethusdt', 'bnbusdt'];
    const url = `wss://stream.binance.com:9443/stream?streams=${streams.map(s => `${s}@trade`).join('/')}`;
    this.ws = new WebSocket(url);

    this.ws.on('message', (data) => {
      try {
        const parsed = JSON.parse(data);
        const trade = parsed.data;

        if (!trade || !trade.s || !trade.p || !trade.q || !trade.T) {
          return;
        }

        const symbol = trade.s.toLowerCase();

        const payload = {
          stream: symbol,
          coin: trade.s,
          price: trade.p,
          quantity: trade.q,
          tradeTime: trade.T,
        };

        const errMsg = this.Trade.verify(payload);
        if (errMsg) throw new Error(errMsg);

        const message = this.Trade.create(payload);
        this.emit('trade', message);
      } catch (e) {}
    });

    this.ws.on('close', () => {});
    this.ws.on('error', () => {});
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  getTradeType() {
    return this.Trade;
  }
}

module.exports = BinanceTradeSocket;
