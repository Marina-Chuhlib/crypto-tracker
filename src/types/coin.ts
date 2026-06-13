export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
  high_24h: number;
  low_24h: number;
  market_cap_rank: number;
}
