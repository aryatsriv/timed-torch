import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import * as Torch from 'expo-torch';
import { TimerState } from '../types';

export function useTorch() {
	const [isTorchOn, setIsTorchOn] = useState(false);
	const [timer, setTimer] = useState<TimerState>({ hours: 0, minutes: 0, seconds: 0 });
	const [remainingSeconds, setRemainingSeconds] = useState(0);
	const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const selectedDurationSeconds = useMemo(
		() => timer.hours * 3600 + timer.minutes * 60 + timer.seconds,
		[timer.hours, timer.minutes, timer.seconds]
	);

	const stopCountdown = useCallback(() => {
		if (countdownRef.current) {
			clearInterval(countdownRef.current);
			countdownRef.current = null;
		}
	}, []);

	const toggleTorch = useCallback(async () => {
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
	}, [isTorchOn, selectedDurationSeconds]);

	useEffect(() => {
		if (!isTorchOn || selectedDurationSeconds === 0) {
			stopCountdown();
			return;
		}

		countdownRef.current = setInterval(() => {
			setRemainingSeconds((prev) => {
				if (prev <= 1) {
					Torch.setStateAsync(Torch.OFF).catch((error) => {
						console.error('Error toggling torch:', error);
					});
					setIsTorchOn(false);
					stopCountdown();
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => {
			stopCountdown();
		};
	}, [isTorchOn, selectedDurationSeconds, stopCountdown]);

	return {
		isTorchOn,
		timer,
		setTimer,
		remainingSeconds,
		selectedDurationSeconds,
		toggleTorch,
	};
}
