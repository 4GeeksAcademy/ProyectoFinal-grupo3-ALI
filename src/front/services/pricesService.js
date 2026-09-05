// Precios en vivo desde CoinGecko (API pública, sin key).
// Límite del plan gratuito: ~10-30 llamadas por minuto. No bajar el intervalo
// de refresco por debajo de 60s o CoinGecko bloquea la IP temporalmente.

const COINS = "bitcoin,ethereum,solana,binancecoin,ripple,hyperliquid,zcash";

const SYMBOLS = {
    bitcoin: "BTC",
    ethereum: "ETH",
    solana: "SOL",
    binancecoin: "BNB",
    ripple: "XRP",
    hyperliquid: "HYPE",
    zcash: "ZEC"
};

export const getPrices = async () => {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${COINS}&vs_currencies=usd&include_24hr_change=true`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("CoinGecko respondió " + res.status);
    const data = await res.json();

    return Object.keys(SYMBOLS)
        .filter((id) => data[id])
        .map((id) => ({
            symbol: SYMBOLS[id],
            price: data[id].usd,
            change: data[id].usd_24h_change
        }));
};