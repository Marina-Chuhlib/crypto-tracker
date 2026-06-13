import { Coin } from '../types/coin';

const BASE_URL = 'https://api.coingecko.com/api/v3';

export const fetchCoins = async (): Promise<Coin[]> => {
  const response = await fetch(
    `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1`,
  );

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data: Coin[] = await response.json();
  return data;
};
