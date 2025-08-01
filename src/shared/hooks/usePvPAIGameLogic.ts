import { useCallback, useEffect, useRef, useState } from 'react'

import type {
    BlockType,
    PlayerInfo,
    PvPAIGameState,
} from '../types/game'
import {
    calculateScore,
    getNeighbors,
    processExplosionsWithDelays,
} from '../utils/gameUtils'
import { useGameLogic } from './useGameLogic'

const createInitialPlayers = (): [PlayerInfo, PlayerInfo] => [
    {
        id: 1,
        name: 'Player 1',
        hp: 200,
        maxHp: 200,
        icon: '👤',
    },
    {
        id: 2,
        name: 'AI',
        hp: 200,
        maxHp: 200,
        icon: '🤖',
    },
]

type PossibleMove = {
    blocks: BlockType[]
    score: number
    priority: number // приоритет хода (больше = лучше)
}

export const usePvPAIGameLogic = (gridSize: number = 8) => {
    const baseGameLogic = useGameLogic(gridSize)
    const timerRef = useRef<number | null>(null)
    const aiThinkingRef = useRef<number | null>(null)
    const baseGameLogicRef = useRef(baseGameLogic)

    const [pvpState, setPvpState] = useState<
        Omit<PvPAIGameState, keyof typeof baseGameLogic.gameState>
    >({
        mode: 'ai',
        players: createInitialPlayers(),
        currentPlayer: 1,
        gameOver: false,
        turnTimeLeft: 60,
        turnDuration: 60,
        isAIThinking: false,
        isAISelecting: false,
        aiThinkingTime: 2500, // 2.5 секунды размышлений
    })

    // Обновляем ref при изменении baseGameLogic
    useEffect(() => {
        baseGameLogicRef.current = baseGameLogic
    }, [baseGameLogic])

    const gameState: PvPAIGameState = {
        ...baseGameLogic.gameState,
        ...pvpState,
    }

    // Применение урона к противнику на основе заработанных очков
    const applyDamageToOpponent = useCallback((score: number) => {
        if (score <= 0) return

        setPvpState((prev) => {
            const opponentId = prev.currentPlayer === 1 ? 2 : 1
            const opponentIndex = opponentId - 1
            const newPlayers = [...prev.players] as [
                PlayerInfo,
                PlayerInfo,
            ]

            newPlayers[opponentIndex] = {
                ...newPlayers[opponentIndex],
                hp: Math.max(0, newPlayers[opponentIndex].hp - score),
            }

            const isGameOver = newPlayers[opponentIndex].hp <= 0

            return {
                ...prev,
                players: newPlayers,
                gameOver: isGameOver,
                winner: isGameOver ? prev.currentPlayer : undefined,
            }
        })
    }, [])

    // Очистка таймера
    const clearTurnTimer = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current)
            timerRef.current = null
        }
    }, [])

    // Очистка таймера ИИ размышлений
    const clearAITimer = useCallback(() => {
        if (aiThinkingRef.current) {
            clearTimeout(aiThinkingRef.current)
            aiThinkingRef.current = null
        }
    }, [])

    // Переключение хода между игроками
    const switchTurn = useCallback(() => {
        setPvpState((prev) => ({
            ...prev,
            currentPlayer: prev.currentPlayer === 1 ? 2 : 1,
            turnTimeLeft: prev.turnDuration,
            isAIThinking: false,
            isAISelecting: false,
        }))
    }, [])

    // Поиск всех возможных цепочек от заданного блока
    const findChainFromBlock = useCallback(
        (
            grid: BlockType[][],
            startBlock: BlockType,
            visited: Set<string> = new Set()
        ): BlockType[] => {
            const chain: BlockType[] = [startBlock]
            const toVisit: BlockType[] = [startBlock]
            const blockKey = `${startBlock.row}-${startBlock.col}`
            visited.add(blockKey)

            while (toVisit.length > 0) {
                const currentBlock = toVisit.shift()!
                const neighbors = getNeighbors(
                    { row: currentBlock.row, col: currentBlock.col },
                    gridSize
                )

                for (const neighbor of neighbors) {
                    const neighborKey = `${neighbor.row}-${neighbor.col}`
                    if (visited.has(neighborKey)) continue

                    const neighborBlock =
                        grid[neighbor.row][neighbor.col]
                    if (
                        neighborBlock &&
                        neighborBlock.color === startBlock.color
                    ) {
                        visited.add(neighborKey)
                        chain.push(neighborBlock)
                        toVisit.push(neighborBlock)
                    }
                }
            }

            return chain
        },
        [gridSize]
    )

    // Поиск всех возможных ходов ИИ
    const findAllPossibleMoves = useCallback(
        (grid: BlockType[][]): PossibleMove[] => {
            const moves: PossibleMove[] = []
            const processedChains = new Set<string>()

            for (let row = 0; row < gridSize; row++) {
                for (let col = 0; col < gridSize; col++) {
                    const block = grid[row][col]
                    if (!block) continue

                    const blockKey = `${row}-${col}`
                    if (processedChains.has(blockKey)) continue

                    // Ищем цепочку от этого блока
                    const visited = new Set<string>()
                    const chain = findChainFromBlock(
                        grid,
                        block,
                        visited
                    )

                    // Отмечаем все блоки в цепочке как обработанные
                    chain.forEach((b) => {
                        processedChains.add(`${b.row}-${b.col}`)
                    })

                    // Учитываем только цепочки от 2 блоков
                    if (chain.length >= 2) {
                        const { blocksToRemove } =
                            processExplosionsWithDelays(grid, chain)
                        const score = calculateScore(blocksToRemove)

                        // Вычисляем приоритет хода
                        let priority = score

                        // Бонус за длинные цепочки
                        if (chain.length >= 5) priority += 20
                        else if (chain.length >= 4) priority += 10
                        else if (chain.length >= 3) priority += 5

                        // Бонус за редкие блоки
                        const color = chain[0].color
                        if (color === 'purple') priority += 15
                        else if (color === 'green') priority += 10
                        else if (color === 'red') priority += 5

                        // Бонус за специальные блоки в цепочке
                        const hasSpecialBlocks = chain.some(
                            (b) =>
                                b.hasBomb ||
                                b.hasHorizontalStripe ||
                                b.hasVerticalStripe
                        )
                        if (hasSpecialBlocks) priority += 25

                        moves.push({ blocks: chain, score, priority })
                    }
                }
            }

            return moves.sort((a, b) => b.priority - a.priority)
        },
        [gridSize, findChainFromBlock]
    )

    // Выполнение хода ИИ
    const makeAIMove = useCallback(() => {
        const moves = findAllPossibleMoves(
            baseGameLogicRef.current.gameState.grid
        )

        if (moves.length === 0) {
            // Нет доступных ходов - пропускаем ход
            switchTurn()
            return
        }

        // ИИ выбирает один из топ-3 ходов для разнообразия
        const topMoves = moves.slice(0, Math.min(3, moves.length))
        const weights = [0.6, 0.3, 0.1] // Вероятности выбора

        let randomValue = Math.random()
        let selectedMoveIndex = 0

        for (let i = 0; i < topMoves.length; i++) {
            randomValue -= weights[i] || 0
            if (randomValue <= 0) {
                selectedMoveIndex = i
                break
            }
        }

        const selectedMove = topMoves[selectedMoveIndex]

        // Фаза 1: Показываем постепенное выделение блоков
        setPvpState((prev) => ({ ...prev, isAISelecting: true }))

        // Массив для отслеживания уже выделенных блоков
        const selectedBlocks: BlockType[] = []
        const selectionDelay = 400 // Задержка между выделением блоков в мс

        // Функция для постепенного выделения блоков
        const selectBlocksSequentially = (blockIndex: number) => {
            if (blockIndex >= selectedMove.blocks.length) {
                // Все блоки выделены - применяем ход через небольшую паузу
                setTimeout(() => {
                    baseGameLogicRef.current.confirmSelection()
                    applyDamageToOpponent(selectedMove.score)

                    // Сбрасываем состояние выделения и переключаем ход
                    setTimeout(() => {
                        switchTurn()
                    }, 200)
                }, 500) // Пауза перед применением хода
                return
            }

            // Добавляем следующий блок в выделение
            selectedBlocks.push(selectedMove.blocks[blockIndex])

            // Обновляем сетку с текущим выделением
            const newGrid =
                baseGameLogicRef.current.gameState.grid.map((row) =>
                    row.map((cell) => ({
                        ...cell,
                        isSelected: selectedBlocks.some(
                            (b) => b.id === cell.id
                        ),
                    }))
                )

            // Обновляем состояние игры
            baseGameLogicRef.current.gameState.selectedBlocks = [
                ...selectedBlocks,
            ]
            baseGameLogicRef.current.gameState.grid = newGrid

            // Планируем выделение следующего блока
            setTimeout(() => {
                selectBlocksSequentially(blockIndex + 1)
            }, selectionDelay)
        }

        // Начинаем последовательное выделение
        selectBlocksSequentially(0)
    }, [findAllPossibleMoves, switchTurn, applyDamageToOpponent])

    // Обработка хода ИИ
    const handleAITurn = useCallback(() => {
        if (gameState.currentPlayer === 2 && !gameState.gameOver) {
            setPvpState((prev) => ({ ...prev, isAIThinking: true }))

            clearAITimer()
            aiThinkingRef.current = setTimeout(() => {
                makeAIMove()
            }, gameState.aiThinkingTime)
        }
    }, [
        gameState.currentPlayer,
        gameState.gameOver,
        gameState.aiThinkingTime,
        makeAIMove,
        clearAITimer,
    ])

    // Переопределенное подтверждение выбора с логикой PvP
    const confirmSelectionPvP = useCallback(() => {
        const { selectedBlocks, grid } = baseGameLogic.gameState

        if (selectedBlocks.length < 2) {
            baseGameLogic.confirmSelection()
            return
        }

        // Вычисляем урон перед применением базовой логики
        const { blocksToRemove } = processExplosionsWithDelays(
            grid,
            selectedBlocks
        )
        const damage = calculateScore(blocksToRemove)

        // Применяем базовую логику подтверждения
        baseGameLogic.confirmSelection()

        // Применяем урон противнику и переключаем ход
        if (damage > 0) {
            clearTurnTimer()
            applyDamageToOpponent(damage)
            switchTurn()
        }
    }, [
        baseGameLogic,
        applyDamageToOpponent,
        switchTurn,
        clearTurnTimer,
    ])

    // Сброс PvP игры
    const resetPvPGame = useCallback(() => {
        clearTurnTimer()
        clearAITimer()
        baseGameLogic.resetGame()
        setPvpState({
            mode: 'ai',
            players: createInitialPlayers(),
            currentPlayer: 1,
            gameOver: false,
            turnTimeLeft: 60,
            turnDuration: 60,
            isAIThinking: false,
            isAISelecting: false,
            aiThinkingTime: 2500,
        })
    }, [baseGameLogic, clearTurnTimer, clearAITimer])

    // Эффект для управления таймером хода
    useEffect(() => {
        if (pvpState.gameOver) {
            clearTurnTimer()
            clearAITimer()
            return
        }

        clearTurnTimer()

        timerRef.current = setInterval(() => {
            setPvpState((prev) => {
                const newTimeLeft = prev.turnTimeLeft - 1

                if (newTimeLeft <= 0) {
                    // Время истекло - сбрасываем выделение и переключаем ход
                    baseGameLogicRef.current.cancelSelection()
                    return {
                        ...prev,
                        currentPlayer:
                            prev.currentPlayer === 1 ? 2 : 1,
                        turnTimeLeft: prev.turnDuration,
                        isAIThinking: false,
                        isAISelecting: false,
                    }
                }

                return {
                    ...prev,
                    turnTimeLeft: newTimeLeft,
                }
            })
        }, 1000)

        return clearTurnTimer
    }, [
        pvpState.currentPlayer,
        pvpState.gameOver,
        clearTurnTimer,
        clearAITimer,
    ])

    // Эффект для обработки хода ИИ
    useEffect(() => {
        handleAITurn()
    }, [handleAITurn])

    // Очистка таймеров при размонтировании компонента
    useEffect(() => {
        return () => {
            clearTurnTimer()
            clearAITimer()
        }
    }, [clearTurnTimer, clearAITimer])

    return {
        gameState,
        // Базовые методы (только для игрока)
        startSelection:
            gameState.currentPlayer === 1
                ? baseGameLogic.startSelection
                : () => {},
        addToSelection:
            gameState.currentPlayer === 1
                ? baseGameLogic.addToSelection
                : () => {},
        pauseSelection:
            gameState.currentPlayer === 1
                ? baseGameLogic.pauseSelection
                : () => {},
        finishSelection:
            gameState.currentPlayer === 1
                ? baseGameLogic.finishSelection
                : () => {},
        cancelPendingSelection:
            gameState.currentPlayer === 1
                ? baseGameLogic.cancelPendingSelection
                : () => {},
        cancelSelection:
            gameState.currentPlayer === 1
                ? baseGameLogic.cancelSelection
                : () => {},
        // PvP методы
        confirmSelection:
            gameState.currentPlayer === 1
                ? confirmSelectionPvP
                : () => {},
        resetGame: resetPvPGame,
        switchTurn,
        applyDamageToOpponent,
    }
}
