import React from 'react';
import { StyleSheet, Text, View, Pressable, Platform } from 'react-native';

interface TorchButtonProps {
	isTorchOn: boolean;
	onToggle: () => void;
}

export const TorchButton = ({ isTorchOn, onToggle }: TorchButtonProps) => {
	return (
		<Pressable
			onPress={onToggle}
			style={({ pressed }) => [
				styles.buttonBase,
				isTorchOn ? styles.buttonOn : styles.buttonOff,
				pressed && styles.buttonPressed,
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
	);
};

const styles = StyleSheet.create({
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
});
