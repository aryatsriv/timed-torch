import React, { useCallback, useMemo } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { COLORS, TIMER_CONSTANTS } from '../constants/theme';
import { TimerState } from '../types';
import { WheelPicker } from './MissionTimer/WheelPicker';

interface MissionTimerProps {
	isTorchOn: boolean;
	timer: TimerState;
	setTimer: React.Dispatch<React.SetStateAction<TimerState>>;
	remainingSeconds: number;
}

const { ITEM_HEIGHT, CONTAINER_HEIGHT } = TIMER_CONSTANTS;

export const MissionTimer = ({
	isTorchOn,
	timer,
	setTimer,
	remainingSeconds,
}: MissionTimerProps) => {
	const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0')), []);
	const minutes = useMemo(() => Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0')), []);
	const seconds = useMemo(() => Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0')), []);

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
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 24
	},
	title: {
		fontSize: 16,
		fontWeight: '900',
		color: COLORS.PRIMARY,
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
		backgroundColor: COLORS.SECONDARY,
		marginRight: 8,
	},
	statusDotActive: {
		backgroundColor: COLORS.ACCENT_RED,
	},
	subtitle: {
		fontSize: 11,
		color: COLORS.TEXT_LIGHT,
		fontWeight: '800',
		letterSpacing: 0.5,
		textTransform: 'uppercase',
	},
	pickerWrapper: {
		height: CONTAINER_HEIGHT,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: COLORS.BACKGROUND_LIGHT,
		borderRadius: 12,
		overflow: 'hidden',
		borderWidth: 2,
		borderColor: COLORS.PRIMARY,
	},
	wheels: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 16,
	},
	separator: {
		fontSize: 32,
		fontWeight: '900',
		color: COLORS.PRIMARY,
		marginHorizontal: 4,
		paddingBottom: 4,
	},
	selectionIndicator: {
		position: 'absolute',
		height: ITEM_HEIGHT + 4,
		width: '92%',
		backgroundColor: COLORS.WHITE,
		borderRadius: 6,
		borderWidth: 1.5,
		borderColor: COLORS.PRIMARY,
		shadowColor: COLORS.PRIMARY,
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
		color: COLORS.TEXT_LIGHT,
		letterSpacing: 1,
	},
	footerValue: {
		fontSize: 10,
		fontWeight: '900',
		color: COLORS.PRIMARY,
		letterSpacing: 1,
	},
	footerValueActive: {
		color: COLORS.ACCENT_RED,
	},
});
