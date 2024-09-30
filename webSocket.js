export const connectWebSocket = (symbol, interval, onMessage) => {
  const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@kline_${interval}`);
  ws.onmessage = (event) => onMessage(JSON.parse(event.data));
  return ws;
};
