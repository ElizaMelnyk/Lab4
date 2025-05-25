import { useEffect, useRef } from "react";
import protobuf from "protobufjs";
import { startBinanceStream, stopBinanceStream } from "./api";
import { TradeMessage, TradeMessages, initialTrades } from "./types";
import tradepb from "./../../trade_pb.js";

interface TradeStreamProps {
  trades: TradeMessages;
  setTrades: React.Dispatch<React.SetStateAction<TradeMessages>>;
}

export const TradeStream = ({ trades, setTrades }: TradeStreamProps) => {
  const wsRef = useRef<WebSocket | null>(null);
  const tradeTypeRef = useRef<protobuf.Type | null>(null);

  useEffect(() => {
    const Trade = (tradepb as any).Trade.Trade;
    tradeTypeRef.current = Trade;

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const handleConnectWS = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    const ws = new WebSocket("wss://localhost:3000");
    ws.binaryType = "arraybuffer";

    ws.onopen = () => {
      startBinanceStream();
    };

    ws.onmessage = (event) => {
      try {
        const Trade = tradeTypeRef.current;
        if (!Trade) return;

        const message = Trade.decode(new Uint8Array(event.data));
        const object = Trade.toObject(message, {
          longs: Number,
          enums: String,
          bytes: String,
        }) as TradeMessage;

        setTrades((prev) => ({
          ...prev,
          [object.coin]: object,
        }));
      } catch (err) {
        console.error("Error decoding protobuf message:", err);
      }
    };

    ws.onclose = () => {
      setTrades(initialTrades);
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    wsRef.current = ws;
  };

  const handleDisconnectWS = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    stopBinanceStream();
    setTrades(initialTrades);
  };

  return (
    <div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <button
          onClick={handleConnectWS}
          style={{
            padding: "0.6rem 1.2rem",
            fontSize: "1rem",
            cursor: "pointer",
            backgroundColor: "#388e3c",
            color: "white",
            border: "none",
            borderRadius: "4px",
            marginRight: "1rem",
          }}
        >
          Підключитись до Binance WebSocket
        </button>

        <button
          onClick={handleDisconnectWS}
          style={{
            padding: "0.6rem 1.2rem",
            fontSize: "1rem",
            cursor: "pointer",
            backgroundColor: "#d32f2f",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Відключитись від Binance WebSocket
        </button>
      </div>

      {Object.values(trades).some((trade) => trade != null) && (
        <div
          style={{
            backgroundColor: "white",
            padding: "1rem",
            borderRadius: "6px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            marginTop: "1rem",
          }}
        >
          {Object.entries(trades).map(([coin, trade]) =>
            trade ? (
              <div key={coin} style={{ marginBottom: "1rem" }}>
                <h3>Останній трейд {coin}</h3>
                <p>
                  <strong>Ціна:</strong> {trade.price}
                </p>
                <p>
                  <strong>Кількість:</strong> {trade.quantity}
                </p>
                <p>
                  <strong>Час:</strong>{" "}
                  {new Date(trade.tradeTime).toLocaleString()}
                </p>
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  );
};
