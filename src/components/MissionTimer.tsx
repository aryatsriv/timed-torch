import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { TimerState } from '../types';
import { formatTime, normalizeValue } from '../utils/time';

interface MissionTimerProps {
	isTorchOn: boolean;
	timer: TimerState;
	setTimer: React.Dispatch<React.SetStateAction<TimerState>>;
	selectedDurationSeconds: number;
	remainingSeconds: number;
}

export const MissionTimer = ({
	isTorchOn,
	timer,
	setTimer,
	selectedDurationSeconds,
	remainingSeconds,
}: MissionTimerProps) => {
	const [hoursText, setHoursText] = useState('00');
	const [minutesText, setMinutesText] = useState('00');
	const [secondsText, setSecondsText] = useState('00');

	useEffect(() => {
		setHoursText(String(timer.hours).padStart(2, '0'));
		setMinutesText(String(timer.minutes).padStart(2, '0'));
		setSecondsText(String(timer.seconds).padStart(2, '0'));
	}, [timer.hours, timer.minutes, timer.seconds]);

	return (
		<View style={styles.timerSection}>
			<View style={styles.timerHeaderRow}>
				<Text style={styles.timerTitle}>MISSION TIMER</Text>
				<Text style={styles.timerMeta}>Enter HH:MM:SS</Text>
			</View>
			<View style={styles.timerStatusRow}>
				<Text style={styles.timerStatusLabel}>Selected</Text>
				<Text style={styles.timerStatusValue}>
					{formatTime(selectedDurationSeconds)}
				</Text>
				{isTorchOn && selectedDurationSeconds > 0 && (
					<Text style={styles.timerStatusValue}>
						Remaining {formatTime(remainingSeconds)}
					</Text>
				)}
			</View>
			<View style={styles.timerPickerRow}>
				<View style={styles.timerInputRow}>
					<TextInput
						value={hoursText}
						onChangeText={(value) => setHoursText(value.replace(/[^0-9]/g, ''))}
						onBlur={() => {
							const normalized = normalizeValue(hoursText, 23);
							setTimer((prev) => ({ ...prev, hours: normalized.numeric }));
							setHoursText(normalized.text);
						}}
						keyboardType="number-pad"
						maxLength={2}
						style={styles.timerInput}
						selectTextOnFocus
					/>
				</View>
				<View style={styles.timerInputRow}>
					<TextInput
						value={minutesText}
						onChangeText={(value) => setMinutesText(value.replace(/[^0-9]/g, ''))}
						onBlur={() => {
							const normalized = normalizeValue(minutesText, 59);
							setTimer((prev) => ({ ...prev, minutes: normalized.numeric }));
							setMinutesText(normalized.text);
						}}
						keyboardType="number-pad"
						maxLength={2}
						style={styles.timerInput}
						selectTextOnFocus
					/>
				</View>
				<View style={styles.timerInputRow}>
					<TextInput
						value={secondsText}
						onChangeText={(value) => setSecondsText(value.replace(/[^0-9]/g, ''))}
						onBlur={() => {
							const normalized = normalizeValue(secondsText, 59);
							setTimer((prev) => ({ ...prev, seconds: normalized.numeric }));
							setSecondsText(normalized.text);
						}}
						keyboardType="number-pad"
						maxLength={2}
						style={styles.timerInput}
						selectTextOnFocus
					/>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	timerSection: {
		marginBottom: 18,
		backgroundColor: '#F8F5EE',
	},
	timerHeaderRow: {
		marginBottom: 10,
	},
	timerTitle: {
		fontSize: 12,
		fontWeight: '800',
		letterSpacing: 1.4,
		color: '#1E2A3A',
		fontFamily: Platform.select({ ios: 'Avenir Next Condensed', android: 'sans-serif-condensed' }),
	},
	timerMeta: {
		marginTop: 4,
		fontSize: 11,
		color: '#64748B',
		fontFamily: Platform.select({ ios: 'Avenir Next', android: 'sans-serif-medium' }),
		letterSpacing: 0.4,
	},
	timerStatusRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 10,
	},
	timerStatusLabel: {
		fontSize: 11,
		fontWeight: '700',
		color: '#1E2A3A',
		fontFamily: Platform.select({ ios: 'Avenir Next Condensed', android: 'sans-serif-condensed' }),
		letterSpacing: 1,
		textTransform: 'uppercase',
	},
	timerStatusValue: {
		fontSize: 12,
		fontWeight: '700',
		color: '#1E2A3A',
		fontFamily: Platform.select({ ios: 'Avenir Next', android: 'sans-serif-medium' }),
		letterSpacing: 0.6,
	},
	timerPickerRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	timerInputRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 8,
		paddingVertical: 6,
	},
	timerInput: {
		minWidth: 44,
		paddingVertical: 4,
		paddingHorizontal: 8,
		borderWidth: 2,
		borderColor: '#1E2A3A',
		textAlign: 'center',
		fontSize: 16,
		fontWeight: '700',
		color: '#0E1621',
		fontFamily: Platform.select({ ios: 'Avenir Next Condensed', android: 'sans-serif-condensed' }),
	},
});
