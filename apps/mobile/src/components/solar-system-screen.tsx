import { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Line, Path } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { useAppTheme, type ThemeName } from '@/components/app-theme';
import { PlanetArtwork } from '@/components/planet-artwork';
import { Colors } from '@/constants/theme';
import {
  calculateAngle,
  fetchPlanets,
  formatDegrees,
  getMobileOrbitRadius,
  selectPlanet,
  setPlanetAngle,
  useAppDispatch,
  useAppSelector,
  type Planet,
  type PlanetId,
} from '@solar-system/store';

function ThemeGlyph({ dark, color }: { dark: boolean; color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      {dark ? (
        <>
          <Circle cx={12} cy={12} r={4} />
          <Line x1={12} y1={2} x2={12} y2={4} />
          <Line x1={12} y1={20} x2={12} y2={22} />
          <Line x1={4.93} y1={4.93} x2={6.34} y2={6.34} />
          <Line x1={17.66} y1={17.66} x2={19.07} y2={19.07} />
          <Line x1={2} y1={12} x2={4} y2={12} />
          <Line x1={20} y1={12} x2={22} y2={12} />
          <Line x1={4.93} y1={19.07} x2={6.34} y2={17.66} />
          <Line x1={17.66} y1={6.34} x2={19.07} y2={4.93} />
        </>
      ) : (
        <Path d="M20.8 13A8.5 8.5 0 0 1 11 3.2 8.7 8.7 0 1 0 20.8 13Z" />
      )}
    </Svg>
  );
}

function PlanetMarker({
  planet,
  diagramSize,
  selected,
  colors,
  onSelect,
  onMove,
}: {
  planet: Planet;
  diagramSize: number;
  selected: boolean;
  colors: (typeof Colors)[ThemeName];
  onSelect: (id: PlanetId) => void;
  onMove: (id: PlanetId, angle: number) => void;
}) {
  const markerSize = Math.max(18, Math.min(planet.size * 1.1, 30));
  const angle = useSharedValue(planet.angle);
  const dragStartAngle = useSharedValue(planet.angle);
  const touchOffsetX = useSharedValue(0);
  const touchOffsetY = useSharedValue(0);
  const orbitRadius = getMobileOrbitRadius(planet.orbit, diagramSize);

  const panGesture = usePanGesture({
    minDistance: 5,
    onBegin: (event) => {
      touchOffsetX.value = event.x - (markerSize + 28) / 2;
      touchOffsetY.value = event.y - markerSize / 2;
    },
    onActivate: () => {
      dragStartAngle.value = angle.value;
    },
    onUpdate: (event) => {
      const startRadians = (dragStartAngle.value * Math.PI) / 180;
      const center = diagramSize / 2;
      angle.value = calculateAngle(
        center + Math.cos(startRadians) * orbitRadius + touchOffsetX.value + event.translationX,
        center + Math.sin(startRadians) * orbitRadius + touchOffsetY.value + event.translationY,
        center,
        center,
      );
    },
    onDeactivate: (event) => {
      if (!event.canceled) {
        scheduleOnRN(onMove, planet.id, angle.value);
      } else {
        angle.value = dragStartAngle.value;
      }
    },
  });
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: Math.cos((angle.value * Math.PI) / 180) * orbitRadius },
      { translateY: Math.sin((angle.value * Math.PI) / 180) * orbitRadius },
    ],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        accessibilityRole="button"
        accessibilityLabel={`${planet.name}${selected ? ', selected' : ''}`}
        style={[
          styles.planetPosition,
          {
            left: diagramSize / 2 - (markerSize + 28) / 2,
            top: diagramSize / 2 - markerSize / 2,
            width: markerSize + 28,
            height: markerSize + 30,
          },
          animatedStyle,
        ]}>
        <Pressable onPress={() => onSelect(planet.id)} style={styles.planetPressable}>
        <View
          style={[
            styles.planet,
            {
              width: markerSize,
              height: markerSize,
            },
          ]}>
          <PlanetArtwork id={planet.id} size={markerSize} />
          {selected && <View style={[styles.selectedPlanetOutline, { borderColor: colors.accent }]} />}
        </View>
        <ThemedText style={[styles.planetLabel, { color: selected ? colors.text : colors.textSecondary }]}>
          {planet.name}
        </ThemedText>
        </Pressable>
      </Animated.View>
    </GestureDetector>
  );
}

export default function SolarSystemScreen() {
  const { themeName, toggleTheme } = useAppTheme();
  const colors = Colors[themeName];
  const dispatch = useAppDispatch();
  const planets = useAppSelector((state) => state.planets.planets);
  const selectedId = useAppSelector((state) => state.planets.selectedPlanet);
  const loading = useAppSelector((state) => state.planets.status === 'loading');
  const error = useAppSelector((state) => state.planets.error);
  const updatedAt = useAppSelector((state) => state.planets.updatedAt);
  const [diagramSize, setDiagramSize] = useState(0);

  useEffect(() => {
    const request = dispatch(fetchPlanets());
    return () => request.abort();
  }, [dispatch]);

  const selected = planets.find((planet) => planet.id === selectedId) ?? null;

  const measureDiagram = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setDiagramSize(Math.min(width, height));
  };

  const movePlanet = (id: PlanetId, angle: number) => {
    dispatch(selectPlanet(id));
    dispatch(setPlanetAngle({ id, angle }));
  };

  const refreshPlanets = () => {
    dispatch(fetchPlanets());
  };

  return (
    <SafeAreaView className={`flex-1 ${themeName === 'dark' ? 'dark bg-dark-background' : 'bg-light-background'}`} edges={['top']}>
      <StatusBar style={themeName === 'dark' ? 'light' : 'dark'} />
      <ScrollView className="flex-1" contentContainerStyle={styles.content}>
        <View className="min-h-[62px] flex-row items-center justify-between border-b" style={{ borderBottomColor: colors.border }}>
          <View className="flex-row items-center gap-2">
            <PlanetArtwork id="solar-system-logo" size={40} />
            <ThemedText style={styles.brandName}>Solar System</ThemedText>
          </View>
          <View className="flex-row items-center gap-2">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Switch to ${themeName === 'dark' ? 'light' : 'dark'} theme`}
              onPress={toggleTheme}
              className="h-[38px] w-[38px] items-center justify-center rounded-full border"
              style={{ borderColor: colors.border }}>
              <ThemeGlyph dark={themeName === 'dark'} color={colors.text} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={refreshPlanets}
              disabled={loading}
              className={`h-[38px] items-center justify-center rounded-full px-3 ${themeName === 'dark' ? 'bg-dark-surface' : 'bg-light-surface'}`}
              style={{ opacity: loading ? 0.6 : 1 }}>
              <ThemedText style={[styles.refreshLabel, { color: colors.text }]}>{loading ? 'Updating…' : '↻ Update'}</ThemedText>
            </Pressable>
          </View>
        </View>

        <View className="gap-1.5 pb-[18px] pt-6">
          <ThemedText style={[styles.eyebrow, { color: colors.accent }]}>INTERACTIVE PLANETARY SYSTEM</ThemedText>
          <ThemedText style={styles.title}>Explore the Solar System</ThemedText>
          <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>Drag a planet to explore its position and details.</ThemedText>
        </View>

        <View className={`mb-4 rounded-[18px] border p-3 ${themeName === 'dark' ? 'bg-dark-surface' : 'bg-light-surface'}`} style={{ borderColor: colors.border }}>
          <View className="flex-row items-center justify-between px-1 pt-1">
            <ThemedText style={styles.sectionTitle}>Solar system</ThemedText>
            <View style={styles.status}>
              <View style={[styles.statusDot, { backgroundColor: error ? colors.error : loading ? colors.warning : colors.success }]} />
              <ThemedText style={[styles.statusText, { color: colors.textSecondary }]}>
                {error ? 'Connection error' : loading ? 'Updating data' : 'System online'}
              </ThemedText>
            </View>
          </View>

          <View className="aspect-square w-full max-h-[450px] items-center justify-center overflow-hidden" onLayout={measureDiagram}>
            {diagramSize > 0 && (
              <View style={{ width: diagramSize, height: diagramSize, alignSelf: 'center' }}>
                {planets.map((planet) => {
                  const orbitSize = getMobileOrbitRadius(planet.orbit, diagramSize) * 2;
                  return (
                    <View
                      key={`orbit-${planet.id}`}
                      pointerEvents="none"
                      style={[
                        styles.orbit,
                        {
                          width: orbitSize,
                          height: orbitSize,
                          left: (diagramSize - orbitSize) / 2,
                          top: (diagramSize - orbitSize) / 2,
                          borderColor: colors.orbit,
                        },
                      ]}
                    />
                  );
                })}
                <View style={[styles.sunGlow, { left: diagramSize / 2 - 34, top: diagramSize / 2 - 34 }]} />
                <View style={[styles.sun, { left: diagramSize / 2 - 21, top: diagramSize / 2 - 21 }]}>
                  <PlanetArtwork id="sun" size={42} />
                </View>
                {planets.map((planet) => (
                  <PlanetMarker
                    key={`${planet.id}-${planet.angle}`}
                    planet={planet}
                    diagramSize={diagramSize}
                    selected={selectedId === planet.id}
                    colors={colors}
                    onSelect={(id) => dispatch(selectPlanet(id))}
                    onMove={movePlanet}
                  />
                ))}
              </View>
            )}
          </View>
          <ThemedText style={[styles.dragHint, { color: colors.textSecondary }]}>Touch and drag planets around their orbits</ThemedText>
        </View>

        <View className={`mb-3 rounded-2xl border p-4 ${themeName === 'dark' ? 'bg-dark-surface' : 'bg-light-surface'}`} style={{ borderColor: colors.border }}>
          <ThemedText style={[styles.eyebrow, { color: colors.textSecondary }]}>SELECTED OBJECT</ThemedText>
          {selected ? (
            <>
              <View style={styles.selectedHeader}>
                <View style={styles.selectedPlanet}>
                  <PlanetArtwork id={selected.id} size={56} />
                </View>
                <View>
                  <ThemedText style={styles.selectedName}>{selected.name}</ThemedText>
                  <ThemedText style={[styles.selectedType, { color: colors.textSecondary }]}>{selected.id === 'earth' ? 'Static position' : 'Planet'}</ThemedText>
                </View>
              </View>
              <InfoRow label="Longitude" value={formatDegrees(selected.longitude)} colors={colors} />
              <InfoRow label="Latitude" value={formatDegrees(selected.latitude)} colors={colors} />
              <InfoRow label="Zodiac sign" value={selected.sign} colors={colors} />
              <InfoRow label="Movement" value={selected.retrograde ? 'Retrograde' : 'Direct'} colors={colors} last />
            </>
          ) : (
            <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>Select a planet to see its details.</ThemedText>
          )}
        </View>

        <View className={`mb-3 rounded-2xl border p-4 ${themeName === 'dark' ? 'bg-dark-surface' : 'bg-light-surface'}`} style={{ borderColor: colors.border }}>
          <ThemedText style={[styles.eyebrow, { color: colors.textSecondary }]}>PLANETS</ThemedText>
          {planets.map((planet) => (
            <Pressable
              key={planet.id}
              accessibilityRole="button"
              onPress={() => dispatch(selectPlanet(planet.id))}
              className="min-h-[46px] flex-row items-center justify-between rounded-lg border-b px-2"
              style={[
                styles.planetRow,
                { borderBottomColor: colors.border, borderBottomWidth: StyleSheet.hairlineWidth },
                selectedId === planet.id && { backgroundColor: colors.surfaceSoft },
              ]}>
              <View style={styles.planetRowInfo}>
                <PlanetArtwork id={planet.id} size={24} />
                <ThemedText style={styles.planetRowName}>{planet.name}</ThemedText>
              </View>
              <ThemedText style={[styles.planetLongitude, { color: colors.textSecondary }]}>
                {formatDegrees(planet.longitude, 1)}
              </ThemedText>
            </Pressable>
          ))}
        </View>

        <View className={`mb-3 rounded-2xl border p-4 ${themeName === 'dark' ? 'bg-dark-surface' : 'bg-light-surface'}`} style={{ borderColor: colors.border }}>
          <ThemedText style={[styles.eyebrow, { color: colors.textSecondary }]}>DATA SOURCE</ThemedText>
          <InfoRow label="API connection" value={error ? 'Error' : loading ? 'Loading' : 'Connected'} colors={colors} />
          <InfoRow label="Planets" value="8 objects" colors={colors} />
          <InfoRow label="Last update" value={updatedAt ? new Date(updatedAt).toLocaleString() : 'Waiting for data'} colors={colors} last />
          {error && <ThemedText style={[styles.errorText, { color: colors.error }]}>{error}</ThemedText>}
        </View>

        <ThemedText style={[styles.footer, { color: colors.textSecondary }]}>Planet positions provided by FreeHoroscopeAPI</ThemedText>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({
  label,
  value,
  colors,
  last = false,
}: {
  label: string;
  value: string;
  colors: (typeof Colors)[ThemeName];
  last?: boolean;
}) {
  return (
    <View style={[styles.infoRow, !last && { borderBottomColor: colors.border }]}>
      <ThemedText style={[styles.infoLabel, { color: colors.textSecondary }]}>{label}</ThemedText>
      <ThemedText style={styles.infoValue}>{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { paddingHorizontal: 18, paddingBottom: 32, maxWidth: 760, width: '100%', alignSelf: 'center' },
  header: { minHeight: 62, borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandName: { fontSize: 19, fontWeight: '600' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconButton: { width: 38, height: 38, borderWidth: 1, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  iconButtonText: { fontSize: 20, lineHeight: 24 },
  refreshButton: { paddingHorizontal: 13, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  refreshLabel: { fontSize: 12, fontWeight: '600' },
  intro: { paddingTop: 24, paddingBottom: 18, gap: 6 },
  eyebrow: { fontSize: 10, fontWeight: '700', letterSpacing: 1.4 },
  title: { fontSize: 25, lineHeight: 31, fontWeight: '600' },
  subtitle: { fontSize: 14, lineHeight: 20 },
  systemCard: { borderRadius: 18, borderWidth: 1, padding: 12, marginBottom: 16 },
  systemCardHeader: { paddingHorizontal: 5, paddingTop: 3, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 15, fontWeight: '600' },
  status: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusText: { fontSize: 10 },
  diagramFrame: { width: '100%', aspectRatio: 1, maxHeight: 450, alignSelf: 'center', justifyContent: 'center', overflow: 'hidden' },
  orbit: { position: 'absolute', borderRadius: 1000, borderWidth: 1 },
  sunGlow: { position: 'absolute', width: 68, height: 68, borderRadius: 34, backgroundColor: 'rgba(249, 115, 22, 0.12)' },
  sun: { position: 'absolute', width: 42, height: 42, alignItems: 'center', justifyContent: 'center' },
  planetPosition: { position: 'absolute', alignItems: 'center', justifyContent: 'flex-start', zIndex: 2 },
  planetPressable: { flex: 1, alignItems: 'center', justifyContent: 'flex-start', width: '100%' },
  planet: { alignItems: 'center', justifyContent: 'center' },
  selectedPlanetOutline: { position: 'absolute', width: '100%', height: '100%', borderRadius: 100, borderWidth: 1.5 },
  planetLabel: { marginTop: 2, fontSize: 9, fontWeight: '500' },
  dragHint: { textAlign: 'center', fontSize: 11, paddingBottom: 4 },
  panel: { borderRadius: 16, borderWidth: 1, padding: 17, marginBottom: 14 },
  selectedHeader: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 17 },
  selectedPlanet: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center' },
  selectedName: { fontSize: 20, fontWeight: '600' },
  selectedType: { fontSize: 12, marginTop: 2 },
  emptyText: { fontSize: 13, paddingTop: 16 },
  infoRow: { minHeight: 40, borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  infoLabel: { fontSize: 12 },
  infoValue: { flexShrink: 1, textAlign: 'right', fontSize: 12, fontWeight: '500' },
  planetRow: { minHeight: 46, borderBottomWidth: StyleSheet.hairlineWidth, borderRadius: 8, paddingHorizontal: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  planetRowInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  planetRowName: { fontSize: 14 },
  planetLongitude: { fontSize: 11 },
  errorText: { fontSize: 12, paddingTop: 8 },
  footer: { fontSize: 10, textAlign: 'center', paddingTop: 4, paddingBottom: 20 },
});
