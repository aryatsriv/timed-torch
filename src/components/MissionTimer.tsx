import React, { useCallback, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
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
		<View>
			<View style={styles.pickerWrapper}>
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
	pickerWrapper: {
		height: CONTAINER_HEIGHT,
		justifyContent: 'center',
		alignItems: 'center',
		overflow: 'hidden',
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
});
