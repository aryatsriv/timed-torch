import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Background } from '../src/components/Background';
import { Header } from '../src/components/Header';
import { MissionTimer } from '../src/components/MissionTimer';
import { TorchButton } from '../src/components/TorchButton';
import { COLORS } from '../src/constants/theme';
import { useTorch } from '../src/hooks/useTorch';

export default function TorchHomeScreen() {
	const {
		isTorchOn,
		timer,
		setTimer,
		remainingSeconds,
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
						remainingSeconds={remainingSeconds}
					/>

					<View style={styles.buttonSpacer} />

					<TorchButton isTorchOn={isTorchOn} onToggle={toggleTorch} />
				</View>

				<View style={styles.footerPanel}>
					<Text style={styles.footerVersion}>V1.0.0-PRO</Text>
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
	mainPanel: {
		flex: 1,
		borderColor: COLORS.PRIMARY,
		padding: 18,
		justifyContent: 'center',
		alignItems: 'center',
	},
	panelTitle: {
		fontSize: 14,
		fontWeight: '800',
		letterSpacing: 1.6,
		color: COLORS.PRIMARY,
		fontFamily: Platform.select({ ios: 'Avenir Next Condensed', android: 'sans-serif-condensed' }),
	},
	panelMeta: {
		marginTop: 4,
		fontSize: 12,
		color: COLORS.TEXT_LIGHT,
		fontFamily: Platform.select({ ios: 'Avenir Next', android: 'sans-serif-medium' }),
		letterSpacing: 0.4,
	},
	buttonSpacer: {
		height: 20,
	},
	footerPanel: {
		marginTop: 16,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	footerText: {
		fontSize: 12,
		fontWeight: '700',
		color: COLORS.PRIMARY,
		fontFamily: Platform.select({ ios: 'Avenir Next Condensed', android: 'sans-serif-condensed' }),
		letterSpacing: 1,
	},
	footerVersion: {
		fontSize: 10,
		fontWeight: '600',
		color: COLORS.TEXT_LIGHT,
		fontFamily: Platform.select({ ios: 'Avenir Next', android: 'sans-serif-medium' }),
		letterSpacing: 1,
	},
});
