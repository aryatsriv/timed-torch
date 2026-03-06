import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, TIMER_CONSTANTS } from '../constants/theme';
import { WheelPicker } from './MissionTimer/WheelPicker';

interface MissionTimerProps {
	isTorchOn: boolean;
	remainingSeconds: number;
	setRemainingSeconds: (seconds: number) => void;
}

const { ITEM_HEIGHT, CONTAINER_HEIGHT } = TIMER_CONSTANTS;

const HOURS_DATA = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES_DATA = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
const SECONDS_DATA = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

export const MissionTimer = ({
	isTorchOn,
	remainingSeconds,
	setRemainingSeconds,
}: MissionTimerProps) => {
	// Calculate current units directly from the source of truth
	const h = Math.floor(remainingSeconds / 3600);
	const m = Math.floor((remainingSeconds % 3600) / 60);
	const s = remainingSeconds % 60;

	console.log("timer" + remainingSeconds);

	const handleValueChange = (newVal: number, unit: 'h' | 'm' | 's') => {
		const newH = unit === 'h' ? newVal : h;
		const newM = unit === 'm' ? newVal : m;
		const newS = unit === 's' ? newVal : s;
		setRemainingSeconds(newH * 3600 + newM * 60 + newS);
	};

	return (
		<View>
			<View style={styles.pickerWrapper}>
				<View style={styles.wheels}>
					<WheelPicker
						data={HOURS_DATA}
						value={h}
						onValueChange={(val) => handleValueChange(val, 'h')}
						disabled={isTorchOn}
					/>
					<Text style={styles.separator}>:</Text>
					<WheelPicker
						data={MINUTES_DATA}
						value={m}
						onValueChange={(val) => handleValueChange(val, 'm')}
						disabled={isTorchOn}
					/>
					<Text style={styles.separator}>:</Text>
					<WheelPicker
						data={SECONDS_DATA}
						value={s}
						onValueChange={(val) => handleValueChange(val, 's')}
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
