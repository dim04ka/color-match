import { useCallback, useEffect, useRef, useState } from 'react'

import type { PlayerInfo, PvPGameState } from '../types/game'
import {
    calculateScore,
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
        name: 'Player 2',
        hp: 200,
        maxHp: 200,
        icon: '👥',
    },
]

export const usePvPGameLogic = (gridSize: number = 8) => {
    const baseGameLogic = useGameLogic(gridSize)
    const timerRef = useRef<number | null>(null)
    const baseGameLogicRef = useRef(baseGameLogic)

    const [pvpState, setPvpState] = useState<
        Omit<PvPGameState, keyof typeof baseGameLogic.gameState>
    >({
        mode: 'pvp',
        players: createInitialPlayers(),
        currentPlayer: 1,
        gameOver: false,
        turnTimeLeft: 60,
        turnDuration: 60,
    })

    // Обновляем ref при изменении baseGameLogic
    useEffect(() => {
        baseGameLogicRef.current = baseGameLogic
    }, [baseGameLogic])

    const gameState: PvPGameState = {
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

    // Переключение хода между игроками
    const switchTurn = useCallback(() => {
        setPvpState((prev) => ({
            ...prev,
            currentPlayer: prev.currentPlayer === 1 ? 2 : 1,
            turnTimeLeft: prev.turnDuration, // сброс времени для нового хода
        }))
    }, [])

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
            clearTurnTimer() // останавливаем таймер при успешном ходе
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
        baseGameLogic.resetGame()
        setPvpState({
            mode: 'pvp',
            players: createInitialPlayers(),
            currentPlayer: 1,
            gameOver: false,
            turnTimeLeft: 60,
            turnDuration: 60,
        })
    }, [baseGameLogic, clearTurnTimer])

    // Эффект для управления таймером хода
    useEffect(() => {
        // Не запускаем таймер если игра окончена
        if (pvpState.gameOver) {
            clearTurnTimer()
            return
        }

        // Очищаем предыдущий таймер
        clearTurnTimer()

        // Запускаем новый таймер
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
                        turnTimeLeft: prev.turnDuration, // сброс времени для нового хода
                    }
                }

                return {
                    ...prev,
                    turnTimeLeft: newTimeLeft,
                }
            })
        }, 1000)

        // Очистка таймера при размонтировании или изменении хода
        return clearTurnTimer
    }, [pvpState.currentPlayer, pvpState.gameOver, clearTurnTimer])

    // Очистка таймера при размонтировании компонента
    useEffect(() => {
        return clearTurnTimer
    }, [clearTurnTimer])

    return {
        gameState,
        // Базовые методы
        startSelection: baseGameLogic.startSelection,
        addToSelection: baseGameLogic.addToSelection,
        pauseSelection: baseGameLogic.pauseSelection,
        finishSelection: baseGameLogic.finishSelection,
        cancelPendingSelection: baseGameLogic.cancelPendingSelection,
        cancelSelection: baseGameLogic.cancelSelection,
        // PvP методы
        confirmSelection: confirmSelectionPvP,
        resetGame: resetPvPGame,
        switchTurn,
        applyDamageToOpponent,
    }
}
