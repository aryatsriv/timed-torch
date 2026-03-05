import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import * as Torch from 'expo-torch';
import { TimerState } from '../types';

/**
 * Enterprise-grade hook for managing torch state and mission-critical countdowns.
 * Handles hardware interaction, timer logic, and state synchronization.
 */
export function useTorch() {
	const [isTorchOn, setIsTorchOn] = useState(false);
	const [timer, setTimer] = useState<TimerState>({ hours: 0, minutes: 0, seconds: 0 });
	const [remainingSeconds, setRemainingSeconds] = useState(0);
	const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

	// Memoized total duration in seconds to prevent unnecessary re-calculations
	const selectedDurationSeconds = useMemo(
		() => timer.hours * 3600 + timer.minutes * 60 + timer.seconds,
		[timer.hours, timer.minutes, timer.seconds]
	);

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
	 * Primary controller for hardware torch state.
	 * Synchronizes hardware state with UI and manages mission initiation.
	 */
	const toggleTorch = useCallback(async () => {
		try {
			const nextState = isTorchOn ? Torch.OFF : Torch.ON;
			await Torch.setStateAsync(nextState);
			
			// Update local state after successful hardware toggle
			setIsTorchOn(!isTorchOn);
			
			// Initiate countdown if mission duration is set and torch is being activated
			if (!isTorchOn && selectedDurationSeconds > 0) {
				setRemainingSeconds(selectedDurationSeconds);
			}
			
			// Reset countdown state if torch is being manually deactivated
			if (isTorchOn) {
				setRemainingSeconds(0);
				stopCountdown();
			}
		} catch (error) {
			// In an enterprise app, this would ideally hit a logging service
			console.error('[Hardware Error] Failed to toggle torch state:', error);
		}
	}, [isTorchOn, selectedDurationSeconds, stopCountdown]);

	/**
	 * Mission Control Effect:
	 * Manages the lifecycle of active missions (timed torch operations).
	 */
	useEffect(() => {
		// Scenarios where no countdown is required:
		// 1. Torch is deactivated
		// 2. Indefinite power mode (selectedDurationSeconds is 0)
		if (!isTorchOn || selectedDurationSeconds === 0) {
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
	}, [isTorchOn, selectedDurationSeconds, stopCountdown]);

	return {
		// State
		isTorchOn,
		timer,
		remainingSeconds,
		selectedDurationSeconds,
		
		// Setters
		setTimer,
		
		// Actions
		toggleTorch,
		stopCountdown,
	};
}
