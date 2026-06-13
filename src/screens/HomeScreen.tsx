import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../store';
import { loadCoins, loadFavorites } from '../store/coinsSlice';
import { Coin } from '../types/coin';
import { RootStackParamList } from '../navigation/types';
import CoinListItem from '../components/CoinListItem';
import SearchBar from '../components/SearchBar';
import ErrorState from '../components/ErrorState';
import { Colors } from '../constants/theme';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const HomeScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const { list, loading, error, favorites } = useAppSelector(
    state => state.coins,
  );

  const [query, setQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    dispatch(loadCoins());
    dispatch(loadFavorites());
  }, [dispatch]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await dispatch(loadCoins());
    setRefreshing(false);
  }, [dispatch]);

  const filteredCoins = useMemo(() => {
    if (!query.trim()) return list;
    const lower = query.toLowerCase();
    return list.filter(
      coin =>
        coin.name.toLowerCase().includes(lower) ||
        coin.symbol.toLowerCase().includes(lower),
    );
  }, [list, query]);

  const handleCoinPress = useCallback(
    (coin: Coin) => {
      navigation.navigate('Details', { coin });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: Coin }) => (
      <CoinListItem
        coin={item}
        isFavorite={favorites.includes(item.id)}
        onPress={handleCoinPress}
      />
    ),
    [handleCoinPress, favorites],
  );

  const keyExtractor = useCallback((item: Coin) => item.id, []);

  if (loading && list.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error && list.length === 0) {
    return (
      <ErrorState
        message={`Не вдалося завантажити дані.\n${error}`}
        onRetry={() => dispatch(loadCoins())}
      />
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <SearchBar value={query} onChangeText={setQuery} />
      <FlatList
        data={filteredCoins}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        removeClippedSubviews
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={10}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
        ListEmptyComponent={<ErrorState message="Монети не знайдено" />}
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  list: {
    flex: 1,
  },
});

export default HomeScreen;
