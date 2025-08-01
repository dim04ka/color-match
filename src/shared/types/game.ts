export type Color = 'red' | 'blue' | 'green' | 'purple'

export type BlockType = {
    id: string
    color: Color
    row: number
    col: number
    isSelected: boolean
    isNew?: boolean // для анимации новых блоков
    animationDelay?: number // задержка анимации в секундах
    hasBomb?: boolean // содержит ли блок бомбу
    hasHorizontalStripe?: boolean // содержит ли блок горизонтальную полосу
    hasVerticalStripe?: boolean // содержит ли блок вертикальную полосу
    isExploding?: boolean // анимация взрыва
    explosionDelay?: number // задержка анимации взрыва в секундах
}

export type GameState = {
    grid: BlockType[][]
    score: number
    selectedBlocks: BlockType[]
    isDragging: boolean
    isPaused: boolean
    pendingConfirmation: boolean
    gridSize: number
}

export type Position = {
    row: number
    col: number
}

export type ScoreMultipliers = Record<Color, number>

export type Language = 'ru' | 'en'

export type GameMode = 'singleplayer' | 'pvp' | 'ai'

export type PlayerInfo = {
    id: 1 | 2
    name: string
    hp: number
    maxHp: number
    icon: string
}

export type PvPGameState = GameState & {
    mode: 'pvp'
    players: [PlayerInfo, PlayerInfo]
    currentPlayer: 1 | 2
    gameOver: boolean
    winner?: 1 | 2
    turnTimeLeft: number // секунды, оставшиеся до конца хода
    turnDuration: number // длительность хода в секундах (по умолчанию 60)
}

export type PvPAIGameState = GameState & {
    mode: 'ai'
    players: [PlayerInfo, PlayerInfo]
    currentPlayer: 1 | 2
    gameOver: boolean
    winner?: 1 | 2
    turnTimeLeft: number
    turnDuration: number
    isAIThinking: boolean // показывает, что ИИ обдумывает ход
    isAISelecting: boolean // показывает, что ИИ демонстрирует свой выбор
    aiThinkingTime: number // время размышления ИИ в миллисекундах
}

export type AppSettings = {
    language: Language
    soundEnabled: boolean
}
