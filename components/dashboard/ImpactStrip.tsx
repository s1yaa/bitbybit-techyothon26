import { Dimensions, StyleSheet, Text, View } from 'react-native';

interface Props {
  totalSorted: number;
  co2Saved: number;
  landfillDiverted: number;
}

const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 32) / 3;

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

export default function ImpactStrip({
  totalSorted,
  co2Saved,
  landfillDiverted,
}: Props) {
  return (
    <View style={styles.container}>
      <MetricCard label="sorted" value={totalSorted.toString()} />
      <MetricCard label="co₂ saved" value={`${co2Saved} kg`} />
      <MetricCard label="landfill" value={`${landfillDiverted} kg`} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    marginTop: 16,
  },
  card: {
    width: cardWidth,
    backgroundColor: '#F1EFE8',
    borderRadius: 8,
    padding: 12,
  },
  label: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
    textTransform: 'lowercase',
  },
  value: {
    fontSize: 20,
    fontWeight: '500',
    color: '#111827',
  },
});