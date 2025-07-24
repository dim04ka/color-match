import { useCallback, useEffect, useState } from 'react'

import type { BlockType, GameState } from '../types/game'
import { vibrate } from '../utils/deviceUtils'
import {
    areAdjacent,
    calculateScore,
    createInitialGrid,
    processExplosionsWithDelays,
    removeBlocksAndDrop,
} from '../utils/gameUtils'

export const useGameLogic = (gridSize: number = 8) => {
    const [gameState, setGameState] = useState<GameState>(() => ({
        grid: createInitialGrid(gridSize),
        score: 0,
        selectedBlocks: [],
        isDragging: false,
        isPaused: false,
        pendingConfirmation: false,
        gridSize,
    }))

    // Сброс анимации новых блоков через 1 секунду
    useEffect(() => {
        const hasNewBlocks = gameState.grid.some((row) =>
            row.some((block) => block.isNew)
        )

        if (hasNewBlocks) {
            const timer = setTimeout(() => {
                setGameState((prev) => ({
                    ...prev,
                    grid: prev.grid.map((row) =>
                        row.map((block) => ({
                            ...block,
                            isNew: false,
                            animationDelay: 0,
                        }))
                    ),
                }))
            }, 1000) // 1 секунда для завершения всех анимаций

            return () => clearTimeout(timer)
        }
    }, [gameState.grid])

    // Начало выделения или продолжение
    const startSelection = useCallback((block: BlockType) => {
        setGameState((prev) => {
            // Если есть приостановленное выделение
            if (prev.isPaused && prev.selectedBlocks.length > 0) {
                const lastSelected =
                    prev.selectedBlocks[
                        prev.selectedBlocks.length - 1
                    ]

                // Проверяем, можно ли продолжить выделение
                const canContinue =
                    block.color === prev.selectedBlocks[0].color &&
                    areAdjacent(
                        {
                            row: lastSelected.row,
                            col: lastSelected.col,
                        },
                        { row: block.row, col: block.col }
                    )

                if (canContinue) {
                    // Продолжаем выделение
                    const newSelectedBlocks = [
                        ...prev.selectedBlocks,
                        block,
                    ]

                    vibrate(30) // Короткая вибрация при продолжении

                    return {
                        ...prev,
                        selectedBlocks: newSelectedBlocks,
                        isDragging: true,
                        isPaused: false,
                        pendingConfirmation: false,
                        grid: prev.grid.map((row) =>
                            row.map((cell) => ({
                                ...cell,
                                isSelected: newSelectedBlocks.some(
                                    (selected) =>
                                        selected.id === cell.id
                                ),
                            }))
                        ),
                    }
                }
                // Если не можем продолжить, завершаем текущее и начинаем новое
                // (логика ниже обработает это)
            }

            // Начинаем новое выделение
            vibrate(50) // Средняя вибрация при начале нового выделения

            return {
                ...prev,
                selectedBlocks: [block],
                isDragging: true,
                isPaused: false,
                pendingConfirmation: false, // автоматически сбрасываем подтверждение
                grid: prev.grid.map((row) =>
                    row.map((cell) => ({
                        ...cell,
                        isSelected: cell.id === block.id,
                    }))
                ),
            }
        })
    }, [])

    // Добавление блока в выделение
    const addToSelection = useCallback((block: BlockType) => {
        setGameState((prev) => {
            // Работаем только если идет перетаскивание
            if (!prev.isDragging) return prev

            const { selectedBlocks } = prev

            // Проверяем, что цвет совпадает
            if (
                selectedBlocks.length === 0 ||
                selectedBlocks[0].color !== block.color
            ) {
                return prev
            }

            // Проверяем, есть ли блок уже в выделении
            const existingIndex = selectedBlocks.findIndex(
                (selected) => selected.id === block.id
            )

            if (existingIndex !== -1) {
                // Если блок уже выделен, обрезаем выделение до этого блока включительно
                const newSelectedBlocks = selectedBlocks.slice(
                    0,
                    existingIndex + 1
                )

                vibrate(20) // Слабая вибрация при откате

                return {
                    ...prev,
                    selectedBlocks: newSelectedBlocks,
                    grid: prev.grid.map((row) =>
                        row.map((cell) => ({
                            ...cell,
                            isSelected: newSelectedBlocks.some(
                                (selected) => selected.id === cell.id
                            ),
                        }))
                    ),
                }
            }

            // Проверяем, что блок соседний с последним выбранным
            const lastSelected =
                selectedBlocks[selectedBlocks.length - 1]
            if (
                !areAdjacent(
                    { row: lastSelected.row, col: lastSelected.col },
                    { row: block.row, col: block.col }
                )
            ) {
                return prev
            }

            const newSelectedBlocks = [...selectedBlocks, block]

            vibrate(25) // Легкая вибрация при добавлении блока

            return {
                ...prev,
                selectedBlocks: newSelectedBlocks,
                grid: prev.grid.map((row) =>
                    row.map((cell) => ({
                        ...cell,
                        isSelected: newSelectedBlocks.some(
                            (selected) => selected.id === cell.id
                        ),
                    }))
                ),
            }
        })
    }, [])

    // Приостановка выделения (при отпускании мыши)
    const pauseSelection = useCallback(() => {
        setGameState((prev) => {
            const selectedCount = prev.selectedBlocks.length

            // Если есть 2+ блоков - сразу переходим к подтверждению
            if (selectedCount >= 2) {
                return {
                    ...prev,
                    isDragging: false,
                    isPaused: false,
                    pendingConfirmation: true,
                }
            } else {
                // Если меньше 2 блоков - сбрасываем
                return {
                    ...prev,
                    selectedBlocks: [],
                    isDragging: false,
                    isPaused: false,
                    pendingConfirmation: false,
                    grid: prev.grid.map((row) =>
                        row.map((cell) => ({
                            ...cell,
                            isSelected: false,
                        }))
                    ),
                }
            }
        })
    }, [])

    // Принудительное завершение выделения (переход к подтверждению)
    const finishSelection = useCallback(() => {
        setGameState((prev) => {
            const selectedCount = prev.selectedBlocks.length

            // Если есть выделенные блоки >= 2, всегда показываем подтверждение
            if (selectedCount >= 2) {
                return {
                    ...prev,
                    isDragging: false,
                    isPaused: false,
                    pendingConfirmation: true,
                }
            } else {
                // Если меньше 2 блоков, сбрасываем выделение
                return {
                    ...prev,
                    selectedBlocks: [],
                    isDragging: false,
                    isPaused: false,
                    pendingConfirmation: false,
                    grid: prev.grid.map((row) =>
                        row.map((cell) => ({
                            ...cell,
                            isSelected: false,
                        }))
                    ),
                }
            }
        })
    }, [])

    // Подтверждение выбора и применение действия
    const confirmSelection = useCallback(() => {
        setGameState((prev) => {
            const { selectedBlocks, grid, score } = prev

            if (selectedBlocks.length < 2) {
                return {
                    ...prev,
                    selectedBlocks: [],
                    pendingConfirmation: false,
                    isPaused: false,
                    grid: grid.map((row) =>
                        row.map((cell) => ({
                            ...cell,
                            isSelected: false,
                        }))
                    ),
                }
            }

            // DEBUG: Проверяем цепные взрывы
            // debugExplosions(grid, selectedBlocks)

            // Обрабатываем взрывы бомб и получаем все блоки для удаления с задержками
            const { blocksToRemove, explosionDelays } =
                processExplosionsWithDelays(grid, selectedBlocks)

            // Подсчитываем очки за все удаляемые блоки (включая взорванные)
            const earnedScore = calculateScore(blocksToRemove)

            // Проверяем, есть ли специальные блоки в выделении для анимации взрыва
            const hasSpecialBlocks = selectedBlocks.some(
                (block) =>
                    block.hasBomb ||
                    block.hasHorizontalStripe ||
                    block.hasVerticalStripe
            )

            if (hasSpecialBlocks) {
                // Находим максимальную задержку для расчета времени удаления
                const maxDelay = Math.max(
                    ...Array.from(explosionDelays.values()),
                    0
                )

                // Показываем анимацию взрыва сразу со всеми задержками
                const gridWithExplosions = grid.map((row) =>
                    row.map((cell) => {
                        const shouldExplode = blocksToRemove.some(
                            (block) => block.id === cell.id
                        )
                        const cellKey = `${cell.row}-${cell.col}`
                        const explosionDelay =
                            explosionDelays.get(cellKey) || 0

                        return {
                            ...cell,
                            isSelected: false,
                            isExploding: shouldExplode,
                            explosionDelay: shouldExplode
                                ? explosionDelay / 1000
                                : 0, // конвертируем в секунды для CSS
                        }
                    })
                )

                // Удаляем блоки после завершения всех анимаций
                setTimeout(() => {
                    setGameState((currentState) => {
                        const newGrid = removeBlocksAndDrop(
                            currentState.grid,
                            blocksToRemove
                        )

                        return {
                            ...currentState,
                            grid: newGrid.map((row) =>
                                row.map((cell) => ({
                                    ...cell,
                                    isSelected: false,
                                    isExploding: false,
                                    explosionDelay: 0,
                                }))
                            ),
                            score: currentState.score + earnedScore,
                            selectedBlocks: [],
                            pendingConfirmation: false,
                            isPaused: false,
                        }
                    })
                }, maxDelay + 800) // максимальная задержка + 800мс анимации взрыва

                return {
                    ...prev,
                    grid: gridWithExplosions,
                    pendingConfirmation: false,
                    isPaused: false,
                }
            } else {
                // Обычное удаление без взрывов
                const newGrid = removeBlocksAndDrop(
                    grid,
                    blocksToRemove
                )

                return {
                    ...prev,
                    grid: newGrid.map((row) =>
                        row.map((cell) => ({
                            ...cell,
                            isSelected: false,
                        }))
                    ),
                    score: score + earnedScore,
                    selectedBlocks: [],
                    pendingConfirmation: false,
                    isPaused: false,
                }
            }
        })
    }, [])

    // Отмена ожидающего подтверждения
    const cancelPendingSelection = useCallback(() => {
        setGameState((prev) => ({
            ...prev,
            selectedBlocks: [],
            pendingConfirmation: false,
            isPaused: false,
            grid: prev.grid.map((row) =>
                row.map((cell) => ({ ...cell, isSelected: false }))
            ),
        }))
    }, [])

    // Сброс выделения
    const cancelSelection = useCallback(() => {
        setGameState((prev) => ({
            ...prev,
            selectedBlocks: [],
            isDragging: false,
            isPaused: false,
            pendingConfirmation: false,
            grid: prev.grid.map((row) =>
                row.map((cell) => ({ ...cell, isSelected: false }))
            ),
        }))
    }, [])

    // Сброс игры
    const resetGame = useCallback(() => {
        setGameState({
            grid: createInitialGrid(gridSize),
            score: 0,
            selectedBlocks: [],
            isDragging: false,
            isPaused: false,
            pendingConfirmation: false,
            gridSize,
        })
    }, [gridSize])

    return {
        gameState,
        startSelection,
        addToSelection,
        pauseSelection,
        finishSelection,
        confirmSelection,
        cancelPendingSelection,
        cancelSelection,
        resetGame,
    }
}
