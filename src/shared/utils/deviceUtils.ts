// Определение мобильного устройства
export const isMobileDevice = (): boolean => {
    if (typeof navigator === 'undefined') return false

    return (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        ) ||
        (typeof window !== 'undefined' && window.innerWidth <= 768)
    )
}

// Определение поддержки touch-событий
export const isTouchDevice = (): boolean => {
    if (typeof window === 'undefined') return false

    return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

// Вибрация с проверкой поддержки
export const vibrate = (pattern: number | number[]): void => {
    if (
        typeof navigator !== 'undefined' &&
        navigator.vibrate &&
        isMobileDevice()
    ) {
        navigator.vibrate(pattern)
    }
}
