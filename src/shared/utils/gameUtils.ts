import type {
    BlockType,
    Color,
    Position,
    ScoreMultipliers,
} from '../types/game'

export const COLORS: Color[] = ['red', 'blue', 'green', 'purple']

// Шанс появления специальных блоков
export const BOMB_CHANCE = 0.03 // 3%
export const HORIZONTAL_STRIPE_CHANCE = 0.01 // 1%
export const VERTICAL_STRIPE_CHANCE = 0.01 // 1%

export const SCORE_MULTIPLIERS: ScoreMultipliers = {
    blue: 1,
    red: 2,
    green: 3,
    purple: 5,
}

// Веса для генерации цветов (больше вес = больше шанс выпадения)
export const COLOR_WEIGHTS: Record<Color, number> = {
    blue: 50, // самый частый (1 очко)
    red: 30, // средний (2 очка)
    green: 15, // редкий (3 очка)
    purple: 5, // очень редкий (5 очков)
}

// Генерация случайного цвета с учётом весов
export const getRandomColor = (): Color => {
    // Создаём массив цветов с повторениями согласно весам
    const weightedColors: Color[] = []

    Object.entries(COLOR_WEIGHTS).forEach(([color, weight]) => {
        for (let i = 0; i < weight; i++) {
            weightedColors.push(color as Color)
        }
    })

    return weightedColors[
        Math.floor(Math.random() * weightedColors.length)
    ]
}

// Генерация блока
export const createBlock = (
    row: number,
    col: number,
    isNew = false,
    animationDelay = 0
): BlockType => {
    const hasBomb = Math.random() < BOMB_CHANCE
    const hasHorizontalStripe =
        !hasBomb && Math.random() < HORIZONTAL_STRIPE_CHANCE
    const hasVerticalStripe =
        !hasBomb &&
        !hasHorizontalStripe &&
        Math.random() < VERTICAL_STRIPE_CHANCE

    return {
        id: `${row}-${col}-${Date.now()}-${Math.random()}`,
        color: getRandomColor(),
        row,
        col,
        isSelected: false,
        isNew,
        animationDelay,
        hasBomb,
        hasHorizontalStripe,
        hasVerticalStripe,
        isExploding: false,
        explosionDelay: 0,
    }
}

// Создание начальной сетки
export const createInitialGrid = (
    gridSize: number
): BlockType[][] => {
    const grid: BlockType[][] = []
    for (let row = 0; row < gridSize; row++) {
        grid[row] = []
        for (let col = 0; col < gridSize; col++) {
            grid[row][col] = createBlock(row, col, false, 0) // начальные блоки без анимации
        }
    }
    return grid
}

// Проверка соседних блоков (4-направления)
export const getNeighbors = (
    position: Position,
    gridSize: number
): Position[] => {
    const { row, col } = position
    const neighbors: Position[] = []

    const directions = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1], // верх, низ, лево, право
    ]

    directions.forEach(([dRow, dCol]) => {
        const newRow = row + dRow
        const newCol = col + dCol

        if (
            newRow >= 0 &&
            newRow < gridSize &&
            newCol >= 0 &&
            newCol < gridSize
        ) {
            neighbors.push({ row: newRow, col: newCol })
        }
    })

    return neighbors
}

// Проверка, являются ли позиции соседними
export const areAdjacent = (
    pos1: Position,
    pos2: Position
): boolean => {
    const rowDiff = Math.abs(pos1.row - pos2.row)
    const colDiff = Math.abs(pos1.col - pos2.col)
    return (
        (rowDiff === 1 && colDiff === 0) ||
        (rowDiff === 0 && colDiff === 1)
    )
}

// Подсчёт очков за цепочку
export const calculateScore = (blocks: BlockType[]): number => {
    if (blocks.length === 0) return 0

    const color = blocks[0].color
    const baseScore = SCORE_MULTIPLIERS[color] * blocks.length
    const lengthBonus = 0
    // const lengthBonus = Math.floor(blocks.length / 3) * 5 // бонус за длинные цепочки

    return baseScore + lengthBonus
}

// Удаление блоков из сетки и падение блоков
export const removeBlocksAndDrop = (
    grid: BlockType[][],
    blocksToRemove: BlockType[]
): BlockType[][] => {
    const newGrid = grid.map((row) => [...row])
    const gridSize = newGrid.length

    // Помечаем блоки для удаления
    const removePositions = new Set(
        blocksToRemove.map((block) => `${block.row}-${block.col}`)
    )

    // Удаляем блоки колонна за колонной
    for (let col = 0; col < gridSize; col++) {
        const column: BlockType[] = []

        // Собираем оставшиеся блоки в колонне с их исходными позициями
        for (let row = gridSize - 1; row >= 0; row--) {
            const block = newGrid[row][col]
            if (!removePositions.has(`${row}-${col}`)) {
                column.push({
                    ...block,
                    isExploding: false,
                    explosionDelay: 0,
                })
            }
        }

        // Заполняем колонну снизу вверх
        for (let row = gridSize - 1; row >= 0; row--) {
            if (row >= gridSize - column.length) {
                const blockIndex = gridSize - 1 - row
                const existingBlock = column[blockIndex]
                const oldRow = existingBlock.row
                const newRow = row

                // Проверяем, упал ли блок (изменилась ли позиция)
                const hasFallen = newRow > oldRow

                newGrid[row][col] = {
                    ...existingBlock,
                    row: newRow,
                    col,
                    // Добавляем анимацию падения только если блок упал
                    isNew: hasFallen,
                    animationDelay: hasFallen ? 0.05 : 0, // фиксированная небольшая задержка для падающих блоков
                }
            } else {
                // Создаём новые блоки сверху с анимацией
                const newBlocksCount = gridSize - column.length
                const newBlockIndex = newBlocksCount - 1 - row
                const animationDelay = newBlockIndex * 0.1 // задержка 0.1с между блоками

                newGrid[row][col] = createBlock(
                    row,
                    col,
                    true,
                    animationDelay
                )
            }
        }
    }

    return newGrid
}

// Получение блоков в горизонтальной полосе (вся строка)
export const getHorizontalStripe = (
    position: Position,
    gridSize: number
): Position[] => {
    const { row } = position
    const stripeBlocks: Position[] = []

    for (let col = 0; col < gridSize; col++) {
        stripeBlocks.push({ row, col })
    }

    return stripeBlocks
}

// Получение блоков в вертикальной полосе (весь столбец)
export const getVerticalStripe = (
    position: Position,
    gridSize: number
): Position[] => {
    const { col } = position
    const stripeBlocks: Position[] = []

    for (let row = 0; row < gridSize; row++) {
        stripeBlocks.push({ row, col })
    }

    return stripeBlocks
}

// Получение блоков в радиусе взрыва (все соседние блоки включая диагонали)
export const getExplosionRadius = (
    position: Position,
    gridSize: number
): Position[] => {
    const { row, col } = position
    const explosionBlocks: Position[] = []

    // Все 8 направлений включая диагонали
    const directions = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1],
    ]

    directions.forEach(([dRow, dCol]) => {
        const newRow = row + dRow
        const newCol = col + dCol

        if (
            newRow >= 0 &&
            newRow < gridSize &&
            newCol >= 0 &&
            newCol < gridSize
        ) {
            explosionBlocks.push({ row: newRow, col: newCol })
        }
    })

    return explosionBlocks
}

// Расчет задержки анимации для цепных взрывов
export const calculateExplosionDelay = (
    bombPosition: Position,
    triggerPositions: Position[]
): number => {
    if (triggerPositions.length === 0) return 0

    // Находим минимальное расстояние до любой из изначальных бомб
    const minDistance = Math.min(
        ...triggerPositions.map((trigger) =>
            Math.max(
                Math.abs(bombPosition.row - trigger.row),
                Math.abs(bombPosition.col - trigger.col)
            )
        )
    )

    // Задержка 200мс за каждый "шаг" от изначальной бомбы
    return minDistance * 200
}

// Обработка взрывов бомб и полос с информацией о задержках анимации
export const processExplosionsWithDelays = (
    grid: BlockType[][],
    selectedBlocks: BlockType[]
): {
    blocksToRemove: BlockType[]
    explosionDelays: Map<string, number>
} => {
    const gridSize = grid.length
    const blocksToRemove = new Set<string>()
    const explodedSpecialBlocks = new Set<string>() // отслеживаем взорванные специальные блоки
    const explosionDelays = new Map<string, number>()

    // Добавляем выбранные блоки
    selectedBlocks.forEach((block) => {
        blocksToRemove.add(`${block.row}-${block.col}`)
    })

    // Ищем специальные блоки в выбранных блоках для начальных взрывов
    const initialSpecialBlocks = selectedBlocks.filter(
        (block) =>
            block.hasBomb ||
            block.hasHorizontalStripe ||
            block.hasVerticalStripe
    )

    // Очередь специальных блоков для взрыва с информацией о "поколении" взрыва
    const specialBlockQueue: {
        block: BlockType
        generation: number
    }[] = initialSpecialBlocks.map((block) => ({
        block,
        generation: 0,
    }))

    // Помечаем начальные специальные блоки как находящиеся в очереди
    initialSpecialBlocks.forEach((block) => {
        explodedSpecialBlocks.add(`${block.row}-${block.col}`)
        explosionDelays.set(`${block.row}-${block.col}`, 0)
    })

    // Обрабатываем цепные взрывы
    while (specialBlockQueue.length > 0) {
        const { block, generation } = specialBlockQueue.shift()!

        let affectedPositions: Position[] = []

        // Определяем область воздействия в зависимости от типа специального блока
        if (block.hasBomb) {
            affectedPositions = getExplosionRadius(
                { row: block.row, col: block.col },
                gridSize
            )
        } else if (block.hasHorizontalStripe) {
            affectedPositions = getHorizontalStripe(
                { row: block.row, col: block.col },
                gridSize
            )
        } else if (block.hasVerticalStripe) {
            affectedPositions = getVerticalStripe(
                { row: block.row, col: block.col },
                gridSize
            )
        }

        // Обрабатываем каждый блок в области воздействия
        affectedPositions.forEach((pos) => {
            const posKey = `${pos.row}-${pos.col}`
            blocksToRemove.add(posKey)

            // Проверяем, есть ли в этой позиции специальный блок
            const blockAtPosition = grid[pos.row][pos.col]
            const hasSpecialPower =
                blockAtPosition?.hasBomb ||
                blockAtPosition?.hasHorizontalStripe ||
                blockAtPosition?.hasVerticalStripe

            if (
                hasSpecialPower &&
                !explodedSpecialBlocks.has(posKey)
            ) {
                // Помечаем новый специальный блок как взорванный и добавляем в очередь
                explodedSpecialBlocks.add(posKey)
                explosionDelays.set(posKey, (generation + 1) * 200)

                // Добавляем новый специальный блок в очередь для взрыва следующего поколения
                specialBlockQueue.push({
                    block: blockAtPosition,
                    generation: generation + 1,
                })
            }
        })
    }

    // Собираем все блоки для удаления
    const allBlocksToRemove: BlockType[] = []
    blocksToRemove.forEach((positionKey) => {
        const [row, col] = positionKey.split('-').map(Number)
        const block = grid[row][col]
        if (block) {
            allBlocksToRemove.push(block)
        }
    })

    return { blocksToRemove: allBlocksToRemove, explosionDelays }
}

// Debug-функция для проверки работы цепных взрывов
export const debugExplosions = (
    grid: BlockType[][],
    selectedBlocks: BlockType[]
): void => {
    console.log('=== DEBUG: Цепные взрывы ===')
    console.log(
        'Выбранные блоки:',
        selectedBlocks.map((b) => {
            const special = []
            if (b.hasBomb) special.push('💣')
            if (b.hasHorizontalStripe) special.push('⬅️➡️')
            if (b.hasVerticalStripe) special.push('⬆️⬇️')
            return `(${b.row},${b.col}) ${special.join('')}`
        })
    )

    const specialBlocks = selectedBlocks.filter(
        (block) =>
            block.hasBomb ||
            block.hasHorizontalStripe ||
            block.hasVerticalStripe
    )
    console.log(
        'Специальные блоки:',
        specialBlocks.map((b) => {
            const type = b.hasBomb
                ? '💣'
                : b.hasHorizontalStripe
                  ? '⬅️➡️'
                  : '⬆️⬇️'
            return `(${b.row},${b.col}) ${type}`
        })
    )

    const { blocksToRemove, explosionDelays } =
        processExplosionsWithDelays(grid, selectedBlocks)

    console.log('Всего блоков для удаления:', blocksToRemove.length)
    console.log(
        'Взорванные блоки:',
        blocksToRemove.map((b) => {
            const special = []
            if (b.hasBomb) special.push('💣')
            if (b.hasHorizontalStripe) special.push('⬅️➡️')
            if (b.hasVerticalStripe) special.push('⬆️⬇️')
            return `(${b.row},${b.col}) ${special.join('')}`
        })
    )

    console.log('Задержки взрывов:')
    Array.from(explosionDelays.entries())
        .sort((a, b) => a[1] - b[1])
        .forEach(([pos, delay]) => {
            const [row, col] = pos.split('-').map(Number)
            const block = grid[row][col]
            const special = []
            if (block?.hasBomb) special.push('💣')
            if (block?.hasHorizontalStripe) special.push('⬅️➡️')
            if (block?.hasVerticalStripe) special.push('⬆️⬇️')
            console.log(`  ${pos}: ${delay}мс ${special.join('')}`)
        })

    console.log('=== END DEBUG ===')
}

// Старая функция для обратной совместимости
export const processExplosions = (
    grid: BlockType[][],
    selectedBlocks: BlockType[]
): BlockType[] => {
    const { blocksToRemove } = processExplosionsWithDelays(
        grid,
        selectedBlocks
    )
    return blocksToRemove
}
