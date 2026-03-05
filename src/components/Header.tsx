import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

interface HeaderProps {
	isTorchOn: boolean;
}

export const Header = () => {

	return (
		<View style={styles.headerPanel}>
			<View style={styles.headerTitleRow}>
				<Text style={styles.headerText}>TORCH KNIGHT</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	headerPanel: {
		paddingVertical: 14,
		paddingHorizontal: 16,
		alignItems: 'center',

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
	}
});
