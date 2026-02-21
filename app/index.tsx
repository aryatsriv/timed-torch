import * as Torch from 'expo-torch';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TorchHomeScreen() {
	const [isTorchOn, setIsTorchOn] = useState(false);

	const toggleTorch = async () => {
		try {
			await Torch.setStateAsync(isTorchOn ? Torch.OFF : Torch.ON);
			setIsTorchOn(!isTorchOn);
		} catch (error) {
			console.error('Error toggling torch:', error);
		}
	};

	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<Text style={styles.title}>FLASH KNIGHT</Text>
				<View style={styles.titleUnderline} />
				<Text style={styles.subtitle}>HERO OF LIGHT</Text>
			</View>

			{/* Torch Button */}
			<TouchableOpacity
				style={[
					styles.torchButton,
					isTorchOn ? styles.torchButtonOn : styles.torchButtonOff
				]}
				onPress={toggleTorch}
				activeOpacity={0.8}
			>
				<View style={styles.buttonInner}>
					<Text style={styles.buttonIcon}>
						{isTorchOn ? '💡' : '🔦'}
					</Text>
					<Text style={styles.buttonText}>
						{isTorchOn ? 'TORCH ON!' : 'TAP TO LIGHT'}
					</Text>
				</View>
			</TouchableOpacity>

			{/* Status Text */}
			<View style={styles.statusContainer}>
				<Text style={styles.statusText}>
					{isTorchOn
						? '⚡ POWER ACTIVATED! ⚡'
						: '✨ Ready for action! ✨'}
				</Text>
			</View>

			{/* Comic-style decorative elements */}
			<View style={styles.starBurst1}>
				<Text style={styles.starText}>POW!</Text>
			</View>
			<View style={styles.starBurst2}>
				<Text style={styles.starText}>ZAP!</Text>
			</View>
			<View style={styles.starBurst3}>
				<Text style={styles.starIcon}>★</Text>
			</View>
			<View style={styles.starBurst4}>
				<Text style={styles.starIcon}>★</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFEB3B',
		alignItems: 'center',
		justifyContent: 'center',
	},
	header: {
		marginBottom: 80,
		alignItems: 'center',
	},
	title: {
		fontSize: 52,
		fontWeight: '900',
		color: '#FF1744',
		letterSpacing: 4,
		textShadowColor: '#000',
		textShadowOffset: { width: 4, height: 4 },
		textShadowRadius: 0,
		fontFamily: 'monospace',
		transform: [{ skewY: '-2deg' }],
	},
	titleUnderline: {
		width: 300,
		height: 8,
		backgroundColor: '#2979FF',
		marginTop: 8,
	},
	subtitle: {
		fontSize: 18,
		fontWeight: '800',
		color: '#2979FF',
		letterSpacing: 3,
		marginTop: 8,
		fontFamily: 'monospace',
	},
	torchButton: {
		width: 220,
		height: 220,
		borderRadius: 110,
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 6, height: 6 },
		shadowOpacity: 0.3,
		shadowRadius: 0,
		elevation: 10,
	},
	torchButtonOff: {
		backgroundColor: '#00E676',
		borderWidth: 8,
		borderColor: '#000',
	},
	torchButtonOn: {
		backgroundColor: '#FFEA00',
		borderWidth: 8,
		borderColor: '#FF1744',
	},
	buttonInner: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	buttonIcon: {
		fontSize: 72,
		marginBottom: 10,
	},
	buttonText: {
		fontSize: 18,
		fontWeight: '900',
		color: '#000',
		letterSpacing: 2,
		fontFamily: 'monospace',
	},
	statusContainer: {
		marginTop: 70,
		paddingHorizontal: 24,
		paddingVertical: 14,
		backgroundColor: '#FF1744',
		borderRadius: 0,
		borderWidth: 4,
		borderColor: '#000',
		transform: [{ rotate: '-1deg' }],
	},
	statusText: {
		fontSize: 18,
		fontWeight: '900',
		color: '#FFEB3B',
		letterSpacing: 2,
		fontFamily: 'monospace',
		textAlign: 'center',
		textShadowColor: '#000',
		textShadowOffset: { width: 2, height: 2 },
		textShadowRadius: 0,
	},
	starBurst1: {
		position: 'absolute',
		top: 120,
		left: 30,
		backgroundColor: '#2979FF',
		borderWidth: 4,
		borderColor: '#000',
		paddingHorizontal: 16,
		paddingVertical: 8,
		transform: [{ rotate: '-15deg' }],
	},
	starBurst2: {
		position: 'absolute',
		top: 140,
		right: 35,
		backgroundColor: '#FF1744',
		borderWidth: 4,
		borderColor: '#000',
		paddingHorizontal: 16,
		paddingVertical: 8,
		transform: [{ rotate: '12deg' }],
	},
	starText: {
		fontSize: 24,
		fontWeight: '900',
		color: '#FFEB3B',
		fontFamily: 'monospace',
		letterSpacing: 1,
	},
	starBurst3: {
		position: 'absolute',
		bottom: 150,
		left: 50,
	},
	starBurst4: {
		position: 'absolute',
		bottom: 180,
		right: 60,
	},
	starIcon: {
		fontSize: 36,
		color: '#FF1744',
		textShadowColor: '#000',
		textShadowOffset: { width: 2, height: 2 },
		textShadowRadius: 0,
	},
});


