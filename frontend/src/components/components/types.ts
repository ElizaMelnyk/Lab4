export interface ServerUser {
    name: string;
    displayName: string;
    email: string;
    avatar: string;
    isAdmin: boolean;
}

export interface TradeMessage {
    stream: string;
    coin: string;
    price: string;
    quantity: string;
    tradeTime: number;
}

export interface TradeMessages {
    [coin: string]: TradeMessage | null;
}

export const initialTrades: TradeMessages = {
    BTCUSDT: null,
    ETHUSDT: null,
    BNBUSDT: null,
};