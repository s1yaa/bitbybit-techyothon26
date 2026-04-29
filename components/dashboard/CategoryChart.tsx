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
              <View style={[styles.iconDot, { backgroundColor: config.color + '22' }]}>
                <View style={[styles.dotInner, { backgroundColor: config.color }]} />
              </View>
              <Text style={styles.label}>{config.label}</Text>
            </View>

            <View style={styles.trackWrap}>
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
            </View>

            <View style={[styles.countBadge, { backgroundColor: config.color + '18' }]}>
              <Text style={[styles.count, { color: config.color }]}>{count}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 115,
    gap: 8,
  },
  iconDot: {
    width: 22,
    height: 22,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  label: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
    flexShrink: 1,
  },
  trackWrap: {
    flex: 1,
    marginHorizontal: 10,
  },
  track: {
    height: 7,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: 7,
    borderRadius: 4,
  },
  countBadge: {
    width: 30,
    height: 22,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: {
    fontSize: 12,
    fontWeight: '700',
  },
});