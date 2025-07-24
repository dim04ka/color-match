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
