import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Coin } from '../types/coin';
import { Colors, Spacing, FontSize } from '../constants/theme';

interface Props {
  coin: Coin;
  isFavorite: boolean;
  onPress: (coin: Coin) => void;
}

const formatPrice = (price: number): string => {
  if (price >= 1) {
    return `$${price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  return `$${price.toFixed(6)}`;
};

const CoinListItem = memo(({ coin, isFavorite, onPress }: Props) => {
  const change = coin.price_change_percentage_24h ?? 0;
  const isPositive = change >= 0;
  const changeSign = isPositive ? '+' : '';
  const changeColor = isPositive ? Colors.positive : Colors.negative;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(coin)}
      activeOpacity={0.7}
    >
      <View style={styles.rank}>
        <Text style={styles.rankText}>{coin.market_cap_rank}</Text>
      </View>

      <View style={styles.iconWrapper}>
        <Image
          source={{ uri: coin.image }}
          style={styles.icon}
          resizeMode="contain"
        />
        {isFavorite && (
          <View style={styles.starBadge}>
            <Text style={styles.starText}>★</Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {coin.name}
        </Text>
        <Text style={styles.symbol}>{coin.symbol.toUpperCase()}</Text>
      </View>

      <View style={styles.priceBlock}>
        <Text style={styles.price}>{formatPrice(coin.current_price)}</Text>
        <Text style={[styles.change, { color: changeColor }]}>
          {changeSign}
          {changeSign}
          {change.toFixed(2)}%
        </Text>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  rank: {
    width: 24,
    marginRight: Spacing.sm,
  },
  rankText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  iconWrapper: {
    position: 'relative',
    marginRight: Spacing.sm,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  starBadge: {
    position: 'absolute',
    bottom: -2,
    right: -4,
    backgroundColor: Colors.surface,
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starText: {
    fontSize: 10,
    color: Colors.primary,
    lineHeight: 12,
  },
  info: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  name: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  symbol: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  priceBlock: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  change: {
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
});

export default CoinListItem;
