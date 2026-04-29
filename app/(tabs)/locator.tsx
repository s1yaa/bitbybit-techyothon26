import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, View } from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LocatorScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#7DB87A" />
      </SafeAreaView>
    );
  }

  if (errorMsg) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </SafeAreaView>
    );
  }

  if (Platform.OS === 'web') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.webFallbackContainer}>
          <Ionicons name="map" size={64} color="#7DB87A" />
          <Text style={styles.title}>Nearby Disposal Locator</Text>
          <Text style={styles.subtitle}>
            The interactive map is available on the mobile app.
            Here are some nearby locations you can visit:
          </Text>
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• GreenTech E-Waste Center (1.2 mi)</Text>
            <Text style={styles.listItem}>• City Hazardous Waste Facility (3.4 mi)</Text>
            <Text style={styles.listItem}>• EcoRecycle Batteries Drop-off (0.8 mi)</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const mockLocations = location ? [
    {
      id: '1',
      title: 'GreenTech E-Waste Center',
      description: 'Accepts old computers, phones, and TVs.',
      coordinate: {
        latitude: location.coords.latitude + 0.005,
        longitude: location.coords.longitude + 0.005,
      },
      type: 'e-waste'
    },
    {
      id: '2',
      title: 'City Hazardous Waste Facility',
      description: 'Safe disposal for paint, chemicals, and bulbs.',
      coordinate: {
        latitude: location.coords.latitude - 0.008,
        longitude: location.coords.longitude + 0.002,
      },
      type: 'hazardous'
    },
    {
      id: '3',
      title: 'EcoRecycle Batteries Drop-off',
      description: 'Drop off all types of batteries here.',
      coordinate: {
        latitude: location.coords.latitude + 0.002,
        longitude: location.coords.longitude - 0.006,
      },
      type: 'battery'
    }
  ] : [];

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          showsUserLocation={true}
        >
          {mockLocations.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={marker.coordinate}
              title={marker.title}
              description={marker.description}
              pinColor={
                marker.type === 'e-waste' ? 'blue' :
                  marker.type === 'hazardous' ? 'red' : 'green'
              }
            >
              <Callout>
                <View style={styles.calloutContainer}>
                  <Text style={styles.calloutTitle}>{marker.title}</Text>
                  <Text style={styles.calloutDescription}>{marker.description}</Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
  webFallbackContainer: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 24,
  },
  listContainer: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 12,
  },
  listItem: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 12,
  },
  calloutContainer: {
    width: 200,
    padding: 8,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  calloutDescription: {
    fontSize: 14,
    color: '#666',
  }
});
