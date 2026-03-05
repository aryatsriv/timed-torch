import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Background } from '../src/components/Background';
import { Header } from '../src/components/Header';
import { MissionTimer } from '../src/components/MissionTimer';
import { TorchButton } from '../src/components/TorchButton';
import { useTorch } from '../src/hooks/useTorch';

export default function TorchHomeScreen() {
	const {
		isTorchOn,
		timer,
		setTimer,
		remainingSeconds,
		selectedDurationSeconds,
		toggleTorch,
	} = useTorch();

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.container}>
				<Background />
				<Header />
				<View style={styles.mainPanel}>
					<MissionTimer
						isTorchOn={isTorchOn}
						timer={timer}
						setTimer={setTimer}
						selectedDurationSeconds={selectedDurationSeconds}
						remainingSeconds={remainingSeconds}
					/>
					<TorchButton isTorchOn={isTorchOn} onToggle={toggleTorch} />
				</View>

				<View style={styles.footerPanel}>
					<Text style={styles.footerText}>SYS-ID TT-OPS-01</Text>
				</View>
			</View>
		</SafeAreaView>
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
	mainPanel: {
		flex: 1,
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
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
});