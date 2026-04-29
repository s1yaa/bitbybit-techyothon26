import { WASTE_CATEGORIES } from '@/constants/waste';
import { WasteCategory } from '@/types';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  breakdown: Record<WasteCategory, number>;
}

export default function CategoryChart({ breakdown }: Props) {
  const entries = Object.entries(breakdown) as [WasteCategory, number][];

  const maxValue = Math.max(...entries.map(([, v]) => v), 1);

  return (
    <View style={styles.container}>
      {entries.map(([category, count]) => {
        const config = WASTE_CATEGORIES[category];
        const widthPercent = (count / maxValue) * 100;

        return (
          <View key={category} style={styles.row}>

            <View style={styles.left}>
              <View
                style={[
                  styles.dot,
                  { backgroundColor: config.color },
                ]}
              />
              <Text style={styles.label}>{config.label}</Text>
            </View>

            <View style={styles.track}>
              <View
                style={[
                  styles.fill,
                  {
                    width: `${widthPercent}%`,
                    backgroundColor: config.color,
                  },
                ]}
              />
            </View>

            <Text style={styles.count}>{count}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingHorizontal: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 110,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  label: {
    fontSize: 13,
    color: '#374151',
  },
  track: {
    flex: 1,
    height: 8,
    backgroundColor: '#f0ede6',
    borderRadius: 4,
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  fill: {
    height: 8,
    borderRadius: 4,
  },
  count: {
    width: 24,
    textAlign: 'right',
    fontSize: 13,
    color: '#111827',
  },
});