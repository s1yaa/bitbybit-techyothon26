import { Ionicons } from '@expo/vector-icons';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface Props {
  totalSorted: number;
  co2Saved: number;
  landfillDiverted: number;
}

const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 52) / 3;

const CARDS = [
  { key: 'sorted', label: 'Items Sorted', icon: 'leaf', color: '#16A34A', bg: '#DCFCE7' },
  { key: 'co2', label: 'CO₂ Saved', icon: 'cloud-outline', color: '#2563EB', bg: '#DBEAFE' },
  { key: 'landfill', label: 'Landfill Saved', icon: 'trash-outline', color: '#D97706', bg: '#FEF3C7' },
] as const;

export default function ImpactStrip({ totalSorted, co2Saved, landfillDiverted }: Props) {
  const values = {
    sorted: totalSorted.toString(),
    co2: `${co2Saved} kg`,
    landfill: `${landfillDiverted} kg`,
  };

  return (
    <View style={styles.row}>
      {CARDS.map(({ key, label, icon, color, bg }, i) => (
        <Animated.View
          key={key}
          entering={FadeInDown.delay(200 + i * 80).springify()}
          style={[styles.card, { width: cardWidth }]}
        >
          <View style={[styles.iconWrap, { backgroundColor: bg }]}>
            <Ionicons name={icon as any} size={18} color={color} />
          </View>
          <Text style={[styles.value, { color }]}>{values[key]}</Text>
          <Text style={styles.label}>{label}</Text>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'flex-start',
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  value: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  label: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});