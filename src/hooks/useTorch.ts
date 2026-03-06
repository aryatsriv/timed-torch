import { useState, useEffect, useRef, useCallback } from 'react';
import * as Torch from 'expo-torch';

/**
 * Enterprise-grade hook for managing torch state and mission-critical countdowns.
 * Handles hardware interaction, timer logic, and state synchronization.
 */
export function useTorch() {
	const [isTorchOn, setIsTorchOn] = useState(false);
	const [remainingSeconds, setRemainingSeconds] = useState(0);
	const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

	/**
	 * Safely clears any active mission countdowns.
	 */
	const stopCountdown = useCallback(() => {
		if (countdownRef.current) {
			clearInterval(countdownRef.current);
			countdownRef.current = null;
		}
	}, []);

	/**
	 * Synchronizes hardware state with UI.
	 */
	const toggleTorch = useCallback(async () => {
		try {
			const nextState = isTorchOn ? Torch.OFF : Torch.ON;
			await Torch.setStateAsync(nextState);

			// Update local state after successful hardware toggle
			setIsTorchOn(!isTorchOn);

			// If torch is being manually deactivated, we keep the remaining seconds as they are
			// so the user can see where it stopped or adjust it.
			if (isTorchOn) {
				stopCountdown();
			}
		} catch (error) {
			// In an enterprise app, this would ideally hit a logging service
			console.error('[Hardware Error] Failed to toggle torch state:', error);
		}
	}, [isTorchOn, stopCountdown]);

	/**
	 * Manages the lifecycle of active missions (timed torch operations).
	 */
	useEffect(() => {
		// Scenarios where no countdown is required:
		// 1. Torch is deactivated
		// 2. Indefinite power mode (remainingSeconds is 0)
		if (!isTorchOn || remainingSeconds === 0) {
			stopCountdown();
			return;
		}

		// Prevent multiple intervals from being spawned
		stopCountdown();

		countdownRef.current = setInterval(() => {
			setRemainingSeconds((prev) => {
				// Mission critical threshold: terminate at 1s to ensure UI hits 0 on final tick
				if (prev <= 1) {
					Torch.setStateAsync(Torch.OFF).catch((err) =>
						console.error('[Hardware Error] Auto-deactivation failed:', err)
					);
					setIsTorchOn(false);
					stopCountdown();
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		// Cleanup: Ensure hardware safety by clearing intervals on unmount
		return () => {
			stopCountdown();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isTorchOn, stopCountdown]);

	return {
		// State
		isTorchOn,
		remainingSeconds,

		// Setters
		setRemainingSeconds,

		// Actions
		toggleTorch,
		stopCountdown,
	};
}
