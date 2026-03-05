import React from 'react';
import { StyleSheet, View } from 'react-native';

export const Background = () => {
	return (
		<View style={styles.backgroundLayer} pointerEvents="none">
			<View style={styles.backgroundHalo} />
			<View style={styles.backgroundBurst} />
		</View>
	);
};

const styles = StyleSheet.create({
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
});
