import styled from 'styled-components'

import { useCallback, useEffect } from 'react'

import { useAppContext } from '@app/contexts/AppContext'
import { usePvPAIGameLogic } from '@shared/hooks/usePvPAIGameLogic'
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
            transform: translateY(-1px);
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

    @media (max-width: 768px) {
        font-size: 14px;
        padding: 10px 20px;
        margin: 16px auto;
    }

    @media (max-width: 480px) {
        font-size: 13px;
        padding: 8px 16px;
        margin: 12px auto;
    }
`

const StyledGameOverOverlay = styled.div`
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
    animation: fadeIn 0.5s ease;

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`

const StyledGameOverCard = styled.div`
    background: linear-gradient(135deg, #2c3e50, #34495e);
    border-radius: 16px;
    padding: 32px;
    text-align: center;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    max-width: 400px;
    width: 90%;
    color: white;

    @media (max-width: 480px) {
        padding: 24px;
        max-width: 320px;
    }
`

const StyledGameOverTitle = styled.h2`
    font-size: 2rem;
    margin-bottom: 16px;
    color: #fff;

    @media (max-width: 480px) {
        font-size: 1.5rem;
        margin-bottom: 12px;
    }
`

const StyledWinnerText = styled.p`
    font-size: 1.2rem;
    margin-bottom: 24px;
    color: #ecf0f1;

    @media (max-width: 480px) {
        font-size: 1rem;
        margin-bottom: 20px;
    }
`

const StyledPlayAgainButton = styled.button`
    background: linear-gradient(135deg, #27ae60, #2ecc71);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 12px 24px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 8px rgba(39, 174, 96, 0.3);

    &:hover {
        background: linear-gradient(135deg, #229954, #27ae60);
        transform: translateY(-1px);
        box-shadow: 0 6px 12px rgba(39, 174, 96, 0.4);
    }

    &:active {
        transform: translateY(0);
        box-shadow: 0 2px 4px rgba(39, 174, 96, 0.3);
    }

    @media (max-width: 480px) {
        font-size: 14px;
        padding: 10px 20px;
    }
`

const StyledAIThinkingIndicator = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin: 16px auto;
    padding: 8px 16px;
    background: rgba(52, 152, 219, 0.2);
    border: 2px solid rgba(52, 152, 219, 0.4);
    border-radius: 8px;
    color: #3498db;
    font-size: 14px;
    font-weight: 600;
    animation: pulse 1.5s infinite;

    @keyframes pulse {
        0%,
        100% {
            opacity: 0.7;
        }
        50% {
            opacity: 1;
        }
    }

    @media (max-width: 480px) {
        font-size: 12px;
        padding: 6px 12px;
    }
`

export const PvPAIColorMatchGame: React.FC = () => {
    const { settings } = useAppContext()
    const {
        gameState,
        startSelection,
        addToSelection,
        pauseSelection,
        finishSelection,
        confirmSelection,
        resetGame,
    } = usePvPAIGameLogic()

    const { playSound } = useSoundEffect()

    const t = (key: Parameters<typeof getTranslation>[1]) =>
        getTranslation(settings.language, key)

    // Обработчики событий для GameGrid
    const handleBlockMouseDown = useCallback(
        (block: BlockType) => {
            if (
                gameState.currentPlayer !== 1 ||
                gameState.isAIThinking ||
                gameState.isAISelecting ||
                gameState.isProcessingMove ||
                gameState.gameOver
            )
                return
            startSelection(block)
        },
        [
            startSelection,
            gameState.currentPlayer,
            gameState.isAIThinking,
            gameState.isAISelecting,
            gameState.isProcessingMove,
            gameState.gameOver,
        ]
    )

    const handleBlockMouseEnter = useCallback(
        (block: BlockType) => {
            if (
                gameState.currentPlayer !== 1 ||
                gameState.isAIThinking ||
                gameState.isAISelecting ||
                gameState.isProcessingMove ||
                gameState.gameOver ||
                !gameState.isDragging
            )
                return
            addToSelection(block)
        },
        [
            addToSelection,
            gameState.currentPlayer,
            gameState.isAIThinking,
            gameState.isAISelecting,
            gameState.isProcessingMove,
            gameState.gameOver,
            gameState.isDragging,
        ]
    )

    const handleMouseUp = useCallback(() => {
        if (
            gameState.currentPlayer !== 1 ||
            gameState.isAIThinking ||
            gameState.isAISelecting ||
            gameState.isProcessingMove ||
            gameState.gameOver ||
            !gameState.isDragging
        )
            return
        pauseSelection()
    }, [
        pauseSelection,
        gameState.currentPlayer,
        gameState.isAIThinking,
        gameState.isAISelecting,
        gameState.isProcessingMove,
        gameState.gameOver,
        gameState.isDragging,
    ])

    const handleDoubleClick = useCallback(() => {
        if (
            gameState.currentPlayer !== 1 ||
            gameState.isAIThinking ||
            gameState.isAISelecting ||
            gameState.isProcessingMove ||
            gameState.gameOver ||
            !gameState.isDragging
        )
            return
        finishSelection()
    }, [
        finishSelection,
        gameState.currentPlayer,
        gameState.isAIThinking,
        gameState.isAISelecting,
        gameState.isProcessingMove,
        gameState.gameOver,
        gameState.isDragging,
    ])

    const handleConfirmSelection = useCallback(() => {
        if (
            gameState.currentPlayer !== 1 ||
            gameState.isAIThinking ||
            gameState.isAISelecting ||
            gameState.isProcessingMove
        )
            return
        confirmSelection()
        if (settings.soundEnabled) {
            playSound('confirm')
        }
    }, [
        confirmSelection,
        settings.soundEnabled,
        playSound,
        gameState.currentPlayer,
        gameState.isAIThinking,
        gameState.isAISelecting,
        gameState.isProcessingMove,
    ])

    // Звуковые эффекты для игровых событий
    useEffect(() => {
        if (!settings.soundEnabled) return

        if (gameState.gameOver && gameState.winner) {
            playSound('explosion')
        }
    }, [
        gameState.gameOver,
        gameState.winner,
        settings.soundEnabled,
        playSound,
    ])

    return (
        <StyledGameContainer>
            <PvPScoreGuide
                players={gameState.players}
                currentPlayer={gameState.currentPlayer}
                turnTimeLeft={gameState.turnTimeLeft}
                onReset={resetGame}
                lastDamage={gameState.lastDamage}
            />

            {(gameState.isAIThinking || gameState.isAISelecting) && (
                <StyledAIThinkingIndicator>
                    🤖{' '}
                    {gameState.isAIThinking
                        ? 'ИИ обдумывает ход...'
                        : 'ИИ выбирает блоки...'}
                </StyledAIThinkingIndicator>
            )}

            <GameGrid
                grid={gameState.grid}
                onBlockMouseDown={handleBlockMouseDown}
                onBlockMouseEnter={handleBlockMouseEnter}
                onMouseUp={handleMouseUp}
                onDoubleClick={handleDoubleClick}
            />

            {gameState.pendingConfirmation &&
                gameState.currentPlayer === 1 &&
                !gameState.isAIThinking &&
                !gameState.isAISelecting &&
                !gameState.isProcessingMove && (
                    <StyledAttackButton
                        onClick={handleConfirmSelection}
                    >
                        ⚔️ {t('attack')}
                    </StyledAttackButton>
                )}

            {gameState.gameOver && !gameState.isProcessingMove && (
                <StyledGameOverOverlay>
                    <StyledGameOverCard>
                        <StyledGameOverTitle>
                            {t('gameOver')}
                        </StyledGameOverTitle>
                        <StyledWinnerText>
                            {gameState.winner === 1
                                ? t('youWin')
                                : t('aiWins')}
                        </StyledWinnerText>
                        <StyledPlayAgainButton onClick={resetGame}>
                            {t('playAgain')}
                        </StyledPlayAgainButton>
                    </StyledGameOverCard>
                </StyledGameOverOverlay>
            )}
        </StyledGameContainer>
    )
}
