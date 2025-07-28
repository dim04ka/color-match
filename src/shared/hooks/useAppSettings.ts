import { useEffect, useState } from 'react'

import type { AppSettings, Language } from '@shared/types/game'

const DEFAULT_SETTINGS: AppSettings = {
    language: 'ru',
    soundEnabled: true,
}

const STORAGE_KEY = 'color-match-settings'

export const useAppSettings = () => {
    const [settings, setSettings] =
        useState<AppSettings>(DEFAULT_SETTINGS)

    // Загружаем настройки из localStorage при инициализации
    useEffect(() => {
        const savedSettings = localStorage.getItem(STORAGE_KEY)
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings)
                setSettings({ ...DEFAULT_SETTINGS, ...parsed })
            } catch (error) {
                console.warn('Ошибка загрузки настроек:', error)
            }
        }
    }, [])

    // Сохраняем настройки в localStorage при изменении
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    }, [settings])

    const updateLanguage = (language: Language) => {
        setSettings((prev) => ({ ...prev, language }))
    }

    const toggleSound = () => {
        setSettings((prev) => ({
            ...prev,
            soundEnabled: !prev.soundEnabled,
        }))
    }

    const resetSettings = () => {
        setSettings(DEFAULT_SETTINGS)
    }

    return {
        settings,
        updateLanguage,
        toggleSound,
        resetSettings,
    }
}
