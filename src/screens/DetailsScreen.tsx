import React, { useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../store';
import { toggleFavorite } from '../store/coinsSlice';
import { RootStackParamList } from '../navigation/types';
import { Colors, Spacing, FontSize } from '../constants/theme';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Details'>;
  route: RouteProp<RootStackParamList, 'Details'>;
};

const formatNumber = (num: number): string => {
  if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(2)}B`;
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(2)}M`;
  return `$${num.toLocaleString('en-US')}`;
};

const formatPrice = (price: number): string => {
  if (price >= 1) {
    return `$${price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  return `$${price.toFixed(6)}`;
};

const DetailsScreen = ({ route }: Props) => {
  const { coin } = route.params;
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(state => state.coins.favorites);
  const isFavorite = favorites.includes(coin.id);

  const isPositive = coin.price_change_percentage_24h >= 0;
  const changeColor = isPositive ? Colors.positive : Colors.negative;

  const handleToggleFavorite = useCallback(() => {
    dispatch(toggleFavorite(coin.id));
  }, [dispatch, coin.id]);

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      <View style={styles.header}>
        <Image
          source={{ uri: coin.image }}
          style={styles.icon}
          resizeMode="contain"
        />
        <View style={styles.headerInfo}>
          <Text style={styles.coinName}>{coin.name}</Text>
          <Text style={styles.coinSymbol}>{coin.symbol.toUpperCase()}</Text>
        </View>
        <TouchableOpacity
          style={[styles.favButton, isFavorite && styles.favButtonActive]}
          onPress={handleToggleFavorite}
          activeOpacity={0.8}
        >
          <Text style={styles.favIcon}>{isFavorite ? '★' : '☆'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.priceBlock}>
        <Text style={styles.currentPrice}>
          {formatPrice(coin.current_price)}
        </Text>
        <Text style={[styles.priceChange, { color: changeColor }]}>
          {isPositive ? '+' : ''}
          {coin.price_change_percentage_24h.toFixed(2)}% за 24г
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Ринкова інформація</Text>
        <InfoRow
          label="Ринкова капіталізація"
          value={formatNumber(coin.market_cap)}
        />
        <InfoRow label="Максимум за 24г" value={formatPrice(coin.high_24h)} />
        <InfoRow label="Мінімум за 24г" value={formatPrice(coin.low_24h)} />
        <InfoRow label="Ранг" value={`#${coin.market_cap_rank}`} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Про монету</Text>
        <Text style={styles.description}>
          {coin.name} ({coin.symbol.toUpperCase()}) — одна з топ-
          {coin.market_cap_rank} криптовалют за ринковою капіталізацією. Поточна
          ціна складає {formatPrice(coin.current_price)}, а ринкова
          капіталізація — {formatNumber(coin.market_cap)}.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  icon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: Spacing.md,
  },
  headerInfo: {
    flex: 1,
  },
  coinName: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  coinSymbol: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  favButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.border,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  favButtonActive: {
    backgroundColor: Colors.primary + '33',
    borderColor: Colors.primary,
  },
  favIcon: {
    fontSize: 22,
    color: Colors.primary,
  },
  priceBlock: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  currentPrice: {
    fontSize: FontSize.xxl,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  priceChange: {
    fontSize: FontSize.md,
    fontWeight: '500',
  },
  card: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardTitle: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  infoLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  infoValue: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  description: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});

export default DetailsScreen;
