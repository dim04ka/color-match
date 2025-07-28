import type { Language } from '@shared/types/game'

type TranslationKeys = {
    // Welcome Screen
    welcomeTitle: string
    welcomeSubtitle: string
    gameDescription: string
    startGame: string
    settings: string

    // Game
    score: string
    confirm: string
    cancel: string
    resetGame: string
    backToMenu: string

    // Settings
    settingsTitle: string
    language: string
    sound: string
    soundOn: string
    soundOff: string
    back: string

    // Languages
    languageRu: string
    languageEn: string
}

const translations: Record<Language, TranslationKeys> = {
    ru: {
        // Welcome Screen
        welcomeTitle: 'Color Match',
        welcomeSubtitle: 'Увлекательная игра-головоломка',
        gameDescription:
            'Выделяйте группы одинаковых цветов и создавайте цепные реакции! Чем больше блоков выберете, тем больше очков получите.',
        startGame: 'Начать игру',
        settings: 'Настройки',

        // Game
        score: 'Счёт',
        confirm: 'Подтвердить',
        cancel: 'Отмена',
        resetGame: 'Сбросить игру',
        backToMenu: 'В меню',

        // Settings
        settingsTitle: 'Настройки',
        language: 'Язык',
        sound: 'Звук',
        soundOn: 'Вкл',
        soundOff: 'Выкл',
        back: 'Назад',

        // Languages
        languageRu: 'Русский',
        languageEn: 'English',
    },
    en: {
        // Welcome Screen
        welcomeTitle: 'Color Match',
        welcomeSubtitle: 'Exciting Puzzle Game',
        gameDescription:
            'Select groups of matching colors and create chain reactions! The more blocks you select, the more points you get.',
        startGame: 'Start Game',
        settings: 'Settings',

        // Game
        score: 'Score',
        confirm: 'Confirm',
        cancel: 'Cancel',
        resetGame: 'Reset Game',
        backToMenu: 'Back to Menu',

        // Settings
        settingsTitle: 'Settings',
        language: 'Language',
        sound: 'Sound',
        soundOn: 'On',
        soundOff: 'Off',
        back: 'Back',

        // Languages
        languageRu: 'Русский',
        languageEn: 'English',
    },
}

export const getTranslation = (
    language: Language,
    key: keyof TranslationKeys
): string => {
    return translations[language][key]
}
