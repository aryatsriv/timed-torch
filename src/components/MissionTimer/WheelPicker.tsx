import React, { useEffect, useRef } from 'react';
import {
	FlatList,
	NativeScrollEvent,
	NativeSyntheticEvent,
	Platform,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { COLORS, TIMER_CONSTANTS } from '../../constants/theme';

interface WheelPickerProps {
	data: string[];
	value: number;
	onValueChange: (val: number) => void;
	disabled: boolean;
}

const { ITEM_HEIGHT, CONTAINER_HEIGHT } = TIMER_CONSTANTS;

export const WheelPicker = React.memo(({
	data,
	value,
	onValueChange,
	disabled,
}: WheelPickerProps) => {
	const flatListRef = useRef<FlatList>(null);
	const isInitialMount = useRef(true);

	const extendedData = ['', ...data, ''];

	// Sync scroll position with value changes (for countdown)
	useEffect(() => {
		if (isInitialMount.current) {
			isInitialMount.current = false;
			return;
		}

		// When disabled (counting down), we programmatically scroll
		if (disabled) {
			flatListRef.current?.scrollToIndex({
				index: value,
				animated: true,
				viewPosition: 0,
			});
		}
	}, [value, disabled]);

	const onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
		if (disabled) return;
		const index = Math.round(event.nativeEvent.contentOffset.y / ITEM_HEIGHT);
		if (index >= 0 && index < data.length) {
			onValueChange(index);
		}
	};

	return (
		<View style={[styles.wheelContainer, disabled && styles.disabledWheel]}>
			<FlatList
				ref={flatListRef}
				data={extendedData}
				keyExtractor={(_, index) => index.toString()}
				renderItem={({ item, index }) => (
					<View style={styles.itemWrapper}>
						<Text
							style={[
								styles.itemText,
								index - 1 === value && styles.selectedItemText,
							]}
						>
							{item}
						</Text>
					</View>
				)}
				showsVerticalScrollIndicator={false}
				snapToInterval={ITEM_HEIGHT}
				snapToAlignment="start"
				decelerationRate="fast"
				onMomentumScrollEnd={onMomentumScrollEnd}
				initialScrollIndex={value}
				getItemLayout={(_, index) => ({
					length: ITEM_HEIGHT,
					offset: ITEM_HEIGHT * index,
					index,
				})}
				scrollEnabled={!disabled}
				removeClippedSubviews={false}
			/>
		</View>
	);
});

WheelPicker.displayName = 'WheelPicker';

const styles = StyleSheet.create({
	wheelContainer: {
		height: CONTAINER_HEIGHT,
		width: 70,
	},
	disabledWheel: {
		opacity: 0.8,
	},
	itemWrapper: {
		height: ITEM_HEIGHT,
		justifyContent: 'center',
		alignItems: 'center',
	},
	itemText: {
		fontSize: 24,
		fontWeight: '600',
		color: COLORS.SECONDARY,
		fontFamily: Platform.select({ ios: 'Courier New', android: 'monospace' }),
	},
	selectedItemText: {
		color: COLORS.PRIMARY,
		fontSize: 32,
		fontWeight: '900',
	},
});
