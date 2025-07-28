import styled from 'styled-components'

import { useCallback, useEffect } from 'react'

import { useAppContext } from '@app/contexts/AppContext'
import { useGameLogic } from '@shared/hooks/useGameLogic'
import { useSoundEffect } from '@shared/hooks/useSoundEffect'
import type { BlockType } from '@shared/types/game'

import { GameGrid } from './GameGrid'
import { GameHUD } from './GameHUD'
import { ScoreGuide } from './ScoreGuide'

// import { SelectionInfo } from './SelectionInfo'

const StyledGameContainer = styled.div`
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

    /* Адаптивные отступы для мобильных */
    @media (max-width: 768px) {
        padding: 16px;
        max-width: 100%;
    }

    @media (max-width: 480px) {
        padding: 12px;
    }

    @media (max-width: 360px) {
        padding: 8px;
    }
`

const StyledAttackButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin: 20px auto;
    padding: 12px 24px;
    background: linear-gradient(135deg, #e74c3c, #c0392b);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 8px rgba(231, 76, 60, 0.3);

    &:hover {
        background: linear-gradient(135deg, #c0392b, #a93226);
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(231, 76, 60, 0.4);
    }

    &:active {
        transform: translateY(0);
        box-shadow: 0 2px 4px rgba(231, 76, 60, 0.3);
    }

    @media (max-width: 480px) {
        padding: 10px 20px;
        font-size: 14px;
    }
`

// const StyledFistIcon = styled.svg`
//     width: 20px;
//     height: 20px;
//     fill: currentColor;

//     @media (max-width: 480px) {
//         width: 18px;
//         height: 18px;
//     }
// `

export const ColorMatchGame = () => {
    const { settings } = useAppContext()
    const { playSound } = useSoundEffect()
    const {
        gameState,
        startSelection,
        addToSelection,
        pauseSelection,
        finishSelection,
        confirmSelection,
        // cancelPendingSelection,
        resetGame,
    } = useGameLogic(8)

    // Отслеживаем начало взрывов для воспроизведения звука
    useEffect(() => {
        if (!settings.soundEnabled) return

        const hasExplosions = gameState.grid.some((row) =>
            row.some((block) => block.isExploding)
        )

        if (hasExplosions) {
            // Воспроизводим звук взрыва
            playSound('explosion', 0.3)
        }
    }, [gameState.grid, settings.soundEnabled, playSound])

    // Звук при подтверждении (только для обычных блоков без взрывов)
    const handleConfirmSelection = useCallback(() => {
        if (settings.soundEnabled) {
            const hasSpecialBlocks = gameState.selectedBlocks.some(
                (block) =>
                    block.hasBomb ||
                    block.hasHorizontalStripe ||
                    block.hasVerticalStripe
            )

            // Воспроизводим звук подтверждения только если нет специальных блоков
            // (для специальных блоков будет звук взрыва)
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
            if (!gameState.isDragging) {
                startSelection(block)
            }
        },
        [gameState.isDragging, startSelection]
    )

    const handleBlockMouseEnter = useCallback(
        (block: BlockType) => {
            if (
                gameState.isDragging &&
                !gameState.pendingConfirmation
            ) {
                addToSelection(block)
            }
        },
        [
            gameState.isDragging,
            gameState.pendingConfirmation,
            addToSelection,
        ]
    )

    const handleMouseUp = useCallback(() => {
        if (gameState.isDragging) {
            pauseSelection()
        }
    }, [gameState.isDragging, pauseSelection])

    const handleDoubleClick = useCallback(() => {
        if (gameState.isDragging) {
            finishSelection()
        }
    }, [gameState.isDragging, finishSelection])

    return (
        <StyledGameContainer>
            <ScoreGuide />

            <GameHUD
                score={gameState.score}
                confirmSelection={handleConfirmSelection}
                onReset={resetGame}
            />

            <GameGrid
                grid={gameState.grid}
                onBlockMouseDown={handleBlockMouseDown}
                onBlockMouseEnter={handleBlockMouseEnter}
                onMouseUp={handleMouseUp}
                onDoubleClick={handleDoubleClick}
            />

            {/* <SelectionInfo
                selectedBlocks={gameState.selectedBlocks}
                isDragging={gameState.isDragging}
                pendingConfirmation={gameState.pendingConfirmation}
                onConfirm={confirmSelection}
                onCancel={cancelPendingSelection}
            /> */}
            {gameState.selectedBlocks.length > 1 ? (
                <StyledAttackButton onClick={handleConfirmSelection}>
                    👊 Нанести урон
                </StyledAttackButton>
            ) : null}
        </StyledGameContainer>
    )
}
