import styled from 'styled-components'

import { useCallback, useEffect } from 'react'

import { useAppContext } from '@app/contexts/AppContext'
import { usePvPGameLogic } from '@shared/hooks/usePvPGameLogic'
import { useSoundEffect } from '@shared/hooks/useSoundEffect'
import type { BlockType } from '@shared/types/game'
import { getTranslation } from '@shared/utils/translations'

import { GameGrid } from './GameGrid'
import { PvPScoreGuide } from './PvPScoreGuide'

const StyledGameContainer = styled.div`
    position: relative;
    max-width: 600px;
    margin: 0 auto;
    padding: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

    /* Адаптивные отступы для мобильных */
    @media (max-width: 768px) {
        max-width: 100%;
    }
`

const StyledAttackButton = styled.button<{ $disabled?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin: 20px auto;
    padding: 12px 24px;
    background: ${({ $disabled }) =>
        $disabled
            ? 'rgba(100, 100, 100, 0.5)'
            : 'linear-gradient(135deg, #e74c3c, #c0392b)'};
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    cursor: ${({ $disabled }) =>
        $disabled ? 'not-allowed' : 'pointer'};
    transition: all 0.2s ease;
    box-shadow: 0 4px 8px rgba(231, 76, 60, 0.3);
    opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};

    &:hover {
        ${({ $disabled }) =>
            !$disabled &&
            `
            background: linear-gradient(135deg, #c0392b, #a93226);
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(231, 76, 60, 0.4);
        `}
    }

    &:active {
        ${({ $disabled }) =>
            !$disabled &&
            `
            transform: translateY(0);
            box-shadow: 0 2px 4px rgba(231, 76, 60, 0.3);
        `}
    }

    @media (max-width: 480px) {
        padding: 10px 20px;
        font-size: 14px;
    }
`

const StyledGameOverModal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`

const StyledGameOverContent = styled.div`
    background: white;
    padding: 2rem;
    border-radius: 15px;
    text-align: center;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    max-width: 400px;
    width: 90%;
`

const StyledGameOverTitle = styled.h2`
    color: #333;
    margin: 0 0 1rem 0;
    font-size: 2rem;
`

const StyledWinnerText = styled.p`
    color: #666;
    font-size: 1.2rem;
    margin: 0 0 2rem 0;
`

const StyledNewGameButton = styled.button`
    background: linear-gradient(135deg, #4caf50, #45a049);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 12px 24px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: linear-gradient(135deg, #45a049, #3d8b40);
        transform: translateY(-2px);
    }
`

export const PvPColorMatchGame = () => {
    const { settings } = useAppContext()
    const { playSound } = useSoundEffect()
    const {
        gameState,
        startSelection,
        addToSelection,
        pauseSelection,
        finishSelection,
        confirmSelection,
        resetGame,
    } = usePvPGameLogic(8)

    const t = (key: Parameters<typeof getTranslation>[1]) =>
        getTranslation(settings.language, key)

    // Отслеживаем начало взрывов для воспроизведения звука
    useEffect(() => {
        if (!settings.soundEnabled) return

        const hasExplosions = gameState.grid.some((row) =>
            row.some((block) => block.isExploding)
        )

        if (hasExplosions) {
            playSound('explosion', 0.3)
        }
    }, [gameState.grid, settings.soundEnabled, playSound])

    // Звук при подтверждении
    const handleConfirmSelection = useCallback(() => {
        if (settings.soundEnabled) {
            const hasSpecialBlocks = gameState.selectedBlocks.some(
                (block) =>
                    block.hasBomb ||
                    block.hasHorizontalStripe ||
                    block.hasVerticalStripe
            )

            if (
                !hasSpecialBlocks &&
                gameState.selectedBlocks.length >= 2
            ) {
                playSound('confirm', 0.4)
            }
        }
        confirmSelection()
    }, [
        settings.soundEnabled,
        gameState.selectedBlocks,
        playSound,
        confirmSelection,
    ])

    const handleBlockMouseDown = useCallback(
        (block: BlockType) => {
            if (!gameState.isDragging && !gameState.gameOver) {
                startSelection(block)
            }
        },
        [gameState.isDragging, gameState.gameOver, startSelection]
    )

    const handleBlockMouseEnter = useCallback(
        (block: BlockType) => {
            if (
                gameState.isDragging &&
                !gameState.pendingConfirmation &&
                !gameState.gameOver
            ) {
                addToSelection(block)
            }
        },
        [
            gameState.isDragging,
            gameState.pendingConfirmation,
            gameState.gameOver,
            addToSelection,
        ]
    )

    const handleMouseUp = useCallback(() => {
        if (gameState.isDragging && !gameState.gameOver) {
            pauseSelection()
        }
    }, [gameState.isDragging, gameState.gameOver, pauseSelection])

    const handleDoubleClick = useCallback(() => {
        if (gameState.isDragging && !gameState.gameOver) {
            finishSelection()
        }
    }, [gameState.isDragging, gameState.gameOver, finishSelection])

    const canAttack =
        gameState.selectedBlocks.length > 1 && !gameState.gameOver

    return (
        <StyledGameContainer>
            <PvPScoreGuide
                players={gameState.players}
                currentPlayer={gameState.currentPlayer}
                turnTimeLeft={gameState.turnTimeLeft}
                onReset={resetGame}
            />

            <GameGrid
                grid={gameState.grid}
                onBlockMouseDown={handleBlockMouseDown}
                onBlockMouseEnter={handleBlockMouseEnter}
                onMouseUp={handleMouseUp}
                onDoubleClick={handleDoubleClick}
            />

            {canAttack && (
                <StyledAttackButton
                    onClick={handleConfirmSelection}
                    $disabled={gameState.gameOver}
                >
                    👊 Нанести урон
                </StyledAttackButton>
            )}

            {/* Модальное окно окончания игры */}
            {gameState.gameOver && (
                <StyledGameOverModal>
                    <StyledGameOverContent>
                        <StyledGameOverTitle>
                            {t('gameOver')}
                        </StyledGameOverTitle>
                        <StyledWinnerText>
                            {t('winner')}:{' '}
                            {gameState.winner === 1
                                ? t('player1')
                                : t('player2')}
                        </StyledWinnerText>
                        <StyledNewGameButton onClick={resetGame}>
                            Новая игра
                        </StyledNewGameButton>
                    </StyledGameOverContent>
                </StyledGameOverModal>
            )}
        </StyledGameContainer>
    )
}
