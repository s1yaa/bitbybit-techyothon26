import { StyleSheet, Text, View } from 'react-native';

interface Props {
  daysThisWeek: boolean[];
}

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function StreakRow({ daysThisWeek }: Props) {
  return (
    <View style={styles.container}>
      {DAYS.map((day, index) => {
        const active = daysThisWeek[index];

        return (
          <View key={index} style={styles.item}>
            <Text style={styles.day}>{day}</Text>
            <View
              style={[
                styles.pip,
                { backgroundColor: active ? '#7DB87A' : '#e5e2da' },
              ]}
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#e5e2da',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  item: {
    alignItems: 'center',
  },
  day: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 6,
  },
  pip: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});