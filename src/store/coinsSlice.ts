import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchCoins } from '../api/coingecko';
import { Coin } from '../types/coin';

const FAVORITES_KEY = '@crypto_favorites';

export const loadCoins = createAsyncThunk('coins/loadCoins', async () => {
  return await fetchCoins();
});

export const loadFavorites = createAsyncThunk(
  'coins/loadFavorites',
  async () => {
    const raw = await AsyncStorage.getItem(FAVORITES_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  },
);

export const toggleFavorite = createAsyncThunk(
  'coins/toggleFavorite',
  async (coinId: string, { getState }) => {
    const state = getState() as { coins: CoinsState };
    const current = state.coins.favorites;
    const updated = current.includes(coinId)
      ? current.filter(id => id !== coinId)
      : [...current, coinId];

    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    return updated;
  },
);

interface CoinsState {
  list: Coin[];
  favorites: string[];
  loading: boolean;
  error: string | null;
}

const initialState: CoinsState = {
  list: [],
  favorites: [],
  loading: false,
  error: null,
};


const coinsSlice = createSlice({
  name: 'coins',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loadCoins.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadCoins.fulfilled, (state, action: PayloadAction<Coin[]>) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(loadCoins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Unknown error';
      });

    builder.addCase(
      loadFavorites.fulfilled,
      (state, action: PayloadAction<string[]>) => {
        state.favorites = action.payload;
      },
    );

    builder.addCase(
      toggleFavorite.fulfilled,
      (state, action: PayloadAction<string[]>) => {
        state.favorites = action.payload;
      },
    );
  },
});

export default coinsSlice.reducer;
