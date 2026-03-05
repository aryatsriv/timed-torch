export const formatTime = (totalSeconds: number): string => {
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;
	return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export const clampValue = (value: number, max: number): number => Math.min(Math.max(value, 0), max);

export const normalizeValue = (rawValue: string, maxValue: number): { numeric: number; text: string } => {
	const numeric = Number.parseInt(rawValue.replace(/[^0-9]/g, ''), 10);
	const safeValue = Number.isNaN(numeric) ? 0 : numeric;
	const clamped = clampValue(safeValue, maxValue);
	return {
		numeric: clamped,
		text: String(clamped).padStart(2, '0'),
	};
};
