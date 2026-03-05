import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/theme';

export const Header = () => {

	return (
		<View style={styles.headerPanel}>
			<View style={styles.headerTitleRow}>
				<Text style={styles.headerText}>TORCH KNIGHT</Text>
			</View>
		</View>
	);
};

Header.displayName = 'Header';

const styles = StyleSheet.create({
	headerPanel: {
		paddingVertical: 14,
		paddingHorizontal: 16,
		alignItems: 'center'
	},
	headerTitleRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	headerText: {
		fontSize: 24,
		fontWeight: '800',
		color: COLORS.TEXT_DARK,
		fontFamily: Platform.select({ ios: 'Avenir Next Condensed', android: 'sans-serif-condensed' }),
		letterSpacing: 1.4,
	},
});
