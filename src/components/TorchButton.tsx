import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/theme';

interface TorchButtonProps {
	isTorchOn: boolean;
	onToggle: () => void;
}

/**
 * Provides a tactile interface for toggling the torch hardware.
 */
export const TorchButton = React.memo(({ isTorchOn, onToggle }: TorchButtonProps) => {
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
					{isTorchOn ? 'STOP TORCH' : 'START TORCH'}
				</Text>
			</View>
		</Pressable>
	);
});

TorchButton.displayName = 'TorchButton';

const styles = StyleSheet.create({
	buttonBase: {
		width: '100%',
		height: 140,
		borderWidth: 3,
		borderColor: COLORS.PRIMARY,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: COLORS.WHITE,
		bottom: 6,
		right: 6,
		shadowColor: COLORS.PRIMARY,
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
		backgroundColor: COLORS.ACCENT_GREEN,
	},
	buttonContent: {
		alignItems: 'center',
	},
	buttonLabel: {
		fontSize: 18,
		fontWeight: '800',
		color: COLORS.TEXT_DARK,
		fontFamily: Platform.select({ ios: 'Avenir Next Condensed', android: 'sans-serif-condensed' }),
		letterSpacing: 1.2,
		textAlign: 'center',
		marginBottom: 8,
	},
	buttonSubLabel: {
		fontSize: 12,
		color: COLORS.TEXT_LIGHT,
		fontFamily: Platform.select({ ios: 'Avenir Next', android: 'sans-serif-medium' }),
		letterSpacing: 0.6,
		textTransform: 'uppercase',
	},
});
