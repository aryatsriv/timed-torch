import React, { useCallback, useEffect, useRef } from 'react';
import {
	FlatList,
	NativeScrollEvent,
	NativeSyntheticEvent,
	Platform,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { TimerState } from '../types';

interface MissionTimerProps {
	isTorchOn: boolean;
	timer: TimerState;
	setTimer: React.Dispatch<React.SetStateAction<TimerState>>;
	selectedDurationSeconds: number;
	remainingSeconds: number;
}

const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 3;
const CONTAINER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

const WheelPicker = ({
	data,
	value,
	onValueChange,
	disabled,
}: {
	data: string[];
	value: number;
	onValueChange: (val: number) => void;
	disabled: boolean;
}) => {
	const flatListRef = useRef<FlatList>(null);
	const isInitialMount = useRef(true);

	// Add padding items for smooth scrolling
	const extendedData = ['', ...data, ''];

	// Sync scroll position with value changes (for countdown)
	useEffect(() => {
		if (isInitialMount.current) {
			isInitialMount.current = false;
			return;
		}
		
		// When disabled (counting down), we programmatically scroll
		if (disabled) {
			flatListRef.current?.scrollToIndex({
				index: value,
				animated: true,
				viewPosition: 0,
			});
		}
	}, [value, disabled]);

	const onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
		if (disabled) return;
		const index = Math.round(event.nativeEvent.contentOffset.y / ITEM_HEIGHT);
		if (index >= 0 && index < data.length) {
			onValueChange(index);
		}
	};

	return (
		<View style={[styles.wheelContainer, disabled && styles.disabledWheel]}>
			<FlatList
				ref={flatListRef}
				data={extendedData}
				keyExtractor={(_, index) => index.toString()}
				renderItem={({ item, index }) => (
					<View style={styles.itemWrapper}>
						<Text
							style={[
								styles.itemText,
								index - 1 === value && styles.selectedItemText,
							]}
						>
							{item}
						</Text>
					</View>
				)}
				showsVerticalScrollIndicator={false}
				snapToInterval={ITEM_HEIGHT}
				snapToAlignment="start"
				decelerationRate="fast"
				onMomentumScrollEnd={onMomentumScrollEnd}
				initialScrollIndex={value}
				getItemLayout={(_, index) => ({
					length: ITEM_HEIGHT,
					offset: ITEM_HEIGHT * index,
					index,
				})}
				scrollEnabled={!disabled}
				removeClippedSubviews={false} // Important for smooth programmatic scrolling
			/>
		</View>
	);
};

export const MissionTimer = ({
	isTorchOn,
	timer,
	setTimer,
	remainingSeconds,
}: MissionTimerProps) => {
	const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
	const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
	const seconds = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

	// Determine which time components to display on the wheels
	const displayTime = isTorchOn ? {
		h: Math.floor(remainingSeconds / 3600),
		m: Math.floor((remainingSeconds % 3600) / 60),
		s: remainingSeconds % 60,
	} : {
		h: timer.hours,
		m: timer.minutes,
		s: timer.seconds,
	};

	const setHours = useCallback((h: number) => setTimer(prev => ({ ...prev, hours: h })), [setTimer]);
	const setMinutes = useCallback((m: number) => setTimer(prev => ({ ...prev, minutes: m })), [setTimer]);
	const setSeconds = useCallback((s: number) => setTimer(prev => ({ ...prev, seconds: s })), [setTimer]);

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>MISSION DURATION</Text>
				<View style={styles.statusIndicatorRow}>
					<View style={[styles.statusDot, isTorchOn && styles.statusDotActive]} />
					<Text style={styles.subtitle}>
						{isTorchOn ? 'COUNTDOWN IN PROGRESS' : 'OPERATOR INPUT REQUIRED'}
					</Text>
				</View>
			</View>

			<View style={styles.pickerWrapper}>
				<View style={styles.selectionIndicator} />
				<View style={styles.wheels}>
					<WheelPicker
						data={hours}
						value={displayTime.h}
						onValueChange={setHours}
						disabled={isTorchOn}
					/>
					<Text style={styles.separator}>:</Text>
					<WheelPicker
						data={minutes}
						value={displayTime.m}
						onValueChange={setMinutes}
						disabled={isTorchOn}
					/>
					<Text style={styles.separator}>:</Text>
					<WheelPicker
						data={seconds}
						value={displayTime.s}
						onValueChange={setSeconds}
						disabled={isTorchOn}
					/>
				</View>
			</View>

			<View style={styles.footerInfo}>
				<Text style={styles.footerLabel}>CHRONO-STATUS:</Text>
				<Text style={[styles.footerValue, isTorchOn && styles.footerValueActive]}>
					{isTorchOn ? 'LOCKED & SYNCED' : 'READY FOR INPUT'}
				</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 24,
		backgroundColor: '#FFFFFF',
		borderWidth: 3,
		borderColor: '#1E2A3A',
		shadowColor: '#1E2A3A',
		shadowOffset: { width: 8, height: 8 },
		shadowOpacity: 0.1,
		shadowRadius: 0,
		elevation: 4,
	},
	header: {
		marginBottom: 24,
	},
	title: {
		fontSize: 16,
		fontWeight: '900',
		color: '#1E2A3A',
		letterSpacing: 1.5,
		fontFamily: Platform.select({ ios: 'Avenir Next Condensed', android: 'sans-serif-condensed' }),
	},
	statusIndicatorRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 6,
	},
	statusDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: '#94A3B8',
		marginRight: 8,
	},
	statusDotActive: {
		backgroundColor: '#EF4444',
	},
	subtitle: {
		fontSize: 11,
		color: '#64748B',
		fontWeight: '800',
		letterSpacing: 0.5,
		textTransform: 'uppercase',
	},
	pickerWrapper: {
		height: CONTAINER_HEIGHT,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F1F5F9',
		borderRadius: 12,
		overflow: 'hidden',
		borderWidth: 2,
		borderColor: '#1E2A3A',
	},
	wheels: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 16,
	},
	wheelContainer: {
		height: CONTAINER_HEIGHT,
		width: 70,
	},
	disabledWheel: {
		opacity: 0.8,
	},
	itemWrapper: {
		height: ITEM_HEIGHT,
		justifyContent: 'center',
		alignItems: 'center',
	},
	itemText: {
		fontSize: 24,
		fontWeight: '600',
		color: '#94A3B8',
		fontFamily: Platform.select({ ios: 'Courier New', android: 'monospace' }),
	},
	selectedItemText: {
		color: '#1E2A3A',
		fontSize: 32,
		fontWeight: '900',
	},
	separator: {
		fontSize: 32,
		fontWeight: '900',
		color: '#1E2A3A',
		marginHorizontal: 4,
		paddingBottom: 4,
	},
	selectionIndicator: {
		position: 'absolute',
		height: ITEM_HEIGHT + 4,
		width: '92%',
		backgroundColor: '#FFFFFF',
		borderRadius: 6,
		borderWidth: 1.5,
		borderColor: '#1E2A3A',
		shadowColor: '#1E2A3A',
		shadowOffset: { width: 4, height: 4 },
		shadowOpacity: 0.05,
		shadowRadius: 0,
	},
	footerInfo: {
		marginTop: 20,
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderTopWidth: 1,
		borderTopColor: '#E2E8F0',
		paddingTop: 12,
	},
	footerLabel: {
		fontSize: 10,
		fontWeight: '800',
		color: '#64748B',
		letterSpacing: 1,
	},
	footerValue: {
		fontSize: 10,
		fontWeight: '900',
		color: '#1E2A3A',
		letterSpacing: 1,
	},
	footerValueActive: {
		color: '#EF4444',
	},
});
