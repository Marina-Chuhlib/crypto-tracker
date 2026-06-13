import { Coin } from '../types/coin';

export type RootStackParamList = {
  Home: undefined;
  Details: { coin: Coin };
};
