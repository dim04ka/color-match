import type { Language } from '@shared/types/game'

type TranslationKeys = {
    // Welcome Screen
    welcomeTitle: string
    welcomeSubtitle: string
    gameDescription: string
    startGame: string
    pvpMode: string
    aiMode: string
    singleplayer: string
    settings: string

    // Game
    score: string
    confirm: string
    cancel: string
    resetGame: string
    backToMenu: string
    attack: string

    // PvP
    player1: string
    player2: string
    yourTurn: string
    gameOver: string
    winner: string
    hp: string
    youWin: string
    aiWins: string
    playAgain: string

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
        startGame: 'Одиночная игра',
        pvpMode: 'Игрок против игрока',
        aiMode: 'Против компьютера',
        singleplayer: 'Одиночная игра',
        settings: 'Настройки',

        // Game
        score: 'Счёт',
        confirm: 'Подтвердить',
        cancel: 'Отмена',
        resetGame: 'Сбросить игру',
        backToMenu: 'В меню',
        attack: 'Атака',

        // PvP
        player1: 'Игрок 1',
        player2: 'Игрок 2',
        yourTurn: 'Ваш ход',
        gameOver: 'Игра окончена',
        winner: 'Победитель',
        hp: 'HP',
        youWin: 'Вы победили!',
        aiWins: 'Компьютер победил!',
        playAgain: 'Играть снова',

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
        startGame: 'Single Player',
        pvpMode: 'Player vs Player',
        aiMode: 'vs Computer',
        singleplayer: 'Single Player',
        settings: 'Settings',

        // Game
        score: 'Score',
        confirm: 'Confirm',
        cancel: 'Cancel',
        resetGame: 'Reset Game',
        backToMenu: 'Back to Menu',
        attack: 'Attack',

        // PvP
        player1: 'Player 1',
        player2: 'Player 2',
        yourTurn: 'Your Turn',
        gameOver: 'Game Over',
        winner: 'Winner',
        hp: 'HP',
        youWin: 'You Win!',
        aiWins: 'AI Wins!',
        playAgain: 'Play Again',

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
