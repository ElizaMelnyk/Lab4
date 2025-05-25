import { useState } from "react";
import { initialTrades, ServerUser, TradeMessages } from "./components/types";
import { UserProfile } from "./components/UserProfile";
import { TradeStream } from "./components/TradeStream";

export const CallbackPage = () => {
  const [user, setUser] = useState<ServerUser | null>(null);
  const [trades, setTrades] = useState<TradeMessages>(initialTrades);

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "600px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f2f2f2",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <UserProfile user={user} setUser={setUser} />
      {user && <TradeStream trades={trades} setTrades={setTrades} />}
    </div>
  );
};

export default CallbackPage;
