import * as Torch from 'expo-torch';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Platform, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function TorchHomeScreen() {
	const [isTorchOn, setIsTorchOn] = useState(false);
	const [timer, setTimer] = useState({ hours: 0, minutes: 0, seconds: 0 });
	const [hoursText, setHoursText] = useState('00');
	const [minutesText, setMinutesText] = useState('00');
	const [secondsText, setSecondsText] = useState('00');
	const [remainingSeconds, setRemainingSeconds] = useState(0);
	const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const selectedDurationSeconds = useMemo(
		() => timer.hours * 3600 + timer.minutes * 60 + timer.seconds,
		[timer.hours, timer.minutes, timer.seconds]
	);

	const formatTime = (totalSeconds: number) => {
		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const seconds = totalSeconds % 60;
		return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
	};

	const toggleTorch = async () => {
		try {
			const nextState = isTorchOn ? Torch.OFF : Torch.ON;
			await Torch.setStateAsync(nextState);
			setIsTorchOn(!isTorchOn);
			if (!isTorchOn && selectedDurationSeconds > 0) {
				setRemainingSeconds(selectedDurationSeconds);
			}
			if (isTorchOn) {
				setRemainingSeconds(0);
			}
		} catch (error) {
			console.error('Error toggling torch:', error);
		}
	};

	const statusLabel = useMemo(() => (isTorchOn ? 'LIVE POWER' : 'STANDBY'), [isTorchOn]);
	const statusTone = isTorchOn ? styles.statusLive : styles.statusStandby;
	const clampValue = (value: number, max: number) => Math.min(Math.max(value, 0), max);
	const normalizeValue = (rawValue: string, maxValue: number) => {
		const numeric = Number.parseInt(rawValue.replace(/[^0-9]/g, ''), 10);
		const safeValue = Number.isNaN(numeric) ? 0 : numeric;
		const clamped = clampValue(safeValue, maxValue);
		return {
			numeric: clamped,
			text: String(clamped).padStart(2, '0'),
		};
	};

	useEffect(() => {
		setHoursText(String(timer.hours).padStart(2, '0'));
		setMinutesText(String(timer.minutes).padStart(2, '0'));
		setSecondsText(String(timer.seconds).padStart(2, '0'));
	}, [timer.hours, timer.minutes, timer.seconds]);

	useEffect(() => {
		if (!isTorchOn || selectedDurationSeconds === 0) {
			if (countdownRef.current) {
				clearInterval(countdownRef.current);
				countdownRef.current = null;
			}
			return;
		}

		countdownRef.current = setInterval(() => {
			setRemainingSeconds((prev) => {
				if (prev <= 1) {
					Torch.setStateAsync(Torch.OFF).catch((error) => {
						console.error('Error toggling torch:', error);
					});
					setIsTorchOn(false);
					if (countdownRef.current) {
						clearInterval(countdownRef.current);
						countdownRef.current = null;
					}
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => {
			if (countdownRef.current) {
				clearInterval(countdownRef.current);
				countdownRef.current = null;
			}
		};
	}, [isTorchOn, selectedDurationSeconds]);

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.container}>
				<View style={styles.backgroundLayer} pointerEvents="none">
					<View style={styles.backgroundHalo} />
					<View style={styles.backgroundBurst} />
				</View>

				<View style={styles.headerPanel}>
					<View style={styles.headerTitleRow}>
						<Text style={styles.headerText}>TORCH OPERATIONS</Text>
						<View style={[styles.statusPill, statusTone]}>
							<Text style={styles.statusText}>{statusLabel}</Text>
						</View>
					</View>
					<Text style={styles.headerSubtext}>
						Enterprise field light control interface
					</Text>
				</View>

				<View style={styles.mainPanel}>
					<View style={styles.comicBorder}>
						<View style={styles.panelHeader}>
							<Text style={styles.panelTitle}>PRIMARY CONTROL</Text>
							<Text style={styles.panelMeta}>Operator access: secure</Text>
						</View>
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
						<Pressable
							onPress={toggleTorch}
							style={({ pressed }) => [
								styles.buttonBase,
								isTorchOn ? styles.buttonOn : styles.buttonOff,
								pressed && styles.buttonPressed
							]}
						>
							<View style={styles.buttonContent}>
								<Text style={styles.buttonLabel}>
									{isTorchOn ? 'DEACTIVATE TORCH' : 'ACTIVATE TORCH'}
								</Text>
								<Text style={styles.buttonSubLabel}>
									{isTorchOn ? 'Intensity: Max' : 'Intensity: Ready'}
								</Text>
							</View>
						</Pressable>
					</View>
				</View>

				<View style={styles.footerPanel}>
					<Text style={styles.footerText}>SYS-ID TT-OPS-01</Text>
					<Text style={styles.footerMeta}>Audit log enabled</Text>
				</View>
			</View>
		</SafeAreaView >
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#F5F2EA',
	},
	container: {
		flex: 1,
		padding: 18,
		backgroundColor: '#F5F2EA',
	},
	backgroundLayer: {
		...StyleSheet.absoluteFillObject,
	},
	backgroundHalo: {
		position: 'absolute',
		top: -80,
		right: -60,
		width: 220,
		height: 220,
		borderRadius: 110,
		backgroundColor: '#E7E0D2',
		borderWidth: 2,
		borderColor: '#D0C7B5',
		opacity: 0.9,
	},
	backgroundBurst: {
		position: 'absolute',
		left: -40,
		bottom: -20,
		width: 180,
		height: 180,
		borderRadius: 14,
		backgroundColor: '#1E2A3A',
		opacity: 0.08,
		transform: [{ rotate: '8deg' }],
	},
	headerPanel: {
		borderWidth: 3,
		borderColor: '#1E2A3A',
		backgroundColor: '#FFFFFF',
		paddingVertical: 14,
		paddingHorizontal: 16,
		marginBottom: 16,
		shadowColor: '#1E2A3A',
		shadowOffset: { width: 6, height: 6 },
		shadowOpacity: 0.2,
		shadowRadius: 0,
		elevation: 6,
	},
	headerTitleRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	headerText: {
		fontSize: 24,
		fontWeight: '800',
		color: '#0E1621',
		fontFamily: Platform.select({ ios: 'Avenir Next Condensed', android: 'sans-serif-condensed' }),
		letterSpacing: 1.4,
	},
	headerSubtext: {
		marginTop: 6,
		fontSize: 12,
		color: '#4B5563',
		fontFamily: Platform.select({ ios: 'Avenir Next', android: 'sans-serif-medium' }),
		letterSpacing: 0.6,
		textTransform: 'uppercase',
	},
	statusPill: {
		paddingVertical: 6,
		paddingHorizontal: 10,
		borderRadius: 999,
		borderWidth: 2,
		borderColor: '#1E2A3A',
	},
	statusLive: {
		backgroundColor: '#D7F3E7',
	},
	statusStandby: {
		backgroundColor: '#F3E8D7',
	},
	statusText: {
		fontSize: 12,
		fontWeight: '800',
		letterSpacing: 1,
		color: '#1E2A3A',
		fontFamily: Platform.select({ ios: 'Avenir Next Condensed', android: 'sans-serif-condensed' }),
	},
	mainPanel: {
		flex: 1,
		backgroundColor: '#FDFBF7',
		borderWidth: 3,
		borderColor: '#1E2A3A',
		padding: 18,
		justifyContent: 'center',
		alignItems: 'center',
	},
	comicBorder: {
		width: '100%',
		padding: 16,
		borderWidth: 2,
		borderColor: '#1E2A3A',
		backgroundColor: '#FFFFFF',
		shadowColor: '#1E2A3A',
		shadowOffset: { width: 10, height: 10 },
		shadowOpacity: 0.15,
		shadowRadius: 0,
		elevation: 8,
	},
	panelHeader: {
		marginBottom: 18,
	},
	panelTitle: {
		fontSize: 14,
		fontWeight: '800',
		letterSpacing: 1.6,
		color: '#1E2A3A',
		fontFamily: Platform.select({ ios: 'Avenir Next Condensed', android: 'sans-serif-condensed' }),
	},
	panelMeta: {
		marginTop: 4,
		fontSize: 12,
		color: '#64748B',
		fontFamily: Platform.select({ ios: 'Avenir Next', android: 'sans-serif-medium' }),
		letterSpacing: 0.4,
	},
	timerSection: {
		marginBottom: 18,
		padding: 12,
		borderWidth: 2,
		borderColor: '#1E2A3A',
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
	timerUnitLabel: {
		paddingVertical: 6,
		textAlign: 'center',
		fontSize: 11,
		fontWeight: '800',
		letterSpacing: 1.2,
		color: '#1E2A3A',
		borderBottomWidth: 2,
		borderBottomColor: '#1E2A3A',
		fontFamily: Platform.select({ ios: 'Avenir Next Condensed', android: 'sans-serif-condensed' }),
	},
	buttonBase: {
		width: '100%',
		height: 140,
		borderWidth: 3,
		borderColor: '#1E2A3A',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#FFFFFF',
		bottom: 6,
		right: 6,
		shadowColor: '#1E2A3A',
		shadowOffset: { width: 6, height: 6 },
		shadowOpacity: 0.2,
		shadowRadius: 0,
	},
	buttonPressed: {
		bottom: 0,
		right: 0,
		shadowOffset: { width: 0, height: 0 },
	},
	buttonOff: {
		backgroundColor: '#E7E2D6',
	},
	buttonOn: {
		backgroundColor: '#BFE7D4',
	},
	buttonContent: {
		alignItems: 'center',
	},
	buttonLabel: {
		fontSize: 18,
		fontWeight: '800',
		color: '#0E1621',
		fontFamily: Platform.select({ ios: 'Avenir Next Condensed', android: 'sans-serif-condensed' }),
		letterSpacing: 1.2,
		textAlign: 'center',
		marginBottom: 8,
	},
	buttonSubLabel: {
		fontSize: 12,
		color: '#4B5563',
		fontFamily: Platform.select({ ios: 'Avenir Next', android: 'sans-serif-medium' }),
		letterSpacing: 0.6,
		textTransform: 'uppercase',
	},
	footerPanel: {
		marginTop: 16,
		alignItems: 'flex-end',
	},
	footerText: {
		fontSize: 12,
		fontWeight: '700',
		color: '#1E2A3A',
		fontFamily: Platform.select({ ios: 'Avenir Next Condensed', android: 'sans-serif-condensed' }),
		letterSpacing: 1,
	},
	footerMeta: {
		marginTop: 4,
		fontSize: 11,
		color: '#64748B',
		fontFamily: Platform.select({ ios: 'Avenir Next', android: 'sans-serif-medium' }),
		letterSpacing: 0.6,
		textTransform: 'uppercase',
	},
});
