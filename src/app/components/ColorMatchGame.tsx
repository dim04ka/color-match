import styled from 'styled-components'

import { useCallback } from 'react'

import { useGameLogic } from '@shared/hooks/useGameLogic'
import type { BlockType } from '@shared/types/game'

import { GameGrid } from './GameGrid'
import { GameHUD } from './GameHUD'
import { ScoreGuide } from './ScoreGuide'
import { SelectionInfo } from './SelectionInfo'

const StyledGameContainer = styled.div`
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`

const StyledTitle = styled.h1`
    text-align: center;
    color: #2d3436;
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 24px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`

const StyledInstructions = styled.div`
    background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
    color: white;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 20px;
    font-size: 14px;
    line-height: 1.5;
`

export const ColorMatchGame = () => {
    const {
        gameState,
        startSelection,
        addToSelection,
        pauseSelection,
        finishSelection,
        confirmSelection,
        cancelPendingSelection,
        resetGame,
    } = useGameLogic(8)

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
            <StyledTitle>ColorMatch Grid</StyledTitle>

            <StyledInstructions>
                <strong>Как играть:</strong> Зажмите и тяните мышь
                (или палец на мобильном) по соседним блокам одного
                цвета, чтобы создать цепочку. Отпустите для завершения
                выделения. Минимум 2 блока для засчёта.
                <br />
                <br />
                <strong>💣 Бомбы:</strong> Взрывают все соседние блоки
                (8 направлений).
                <br />
                <strong>⬅️➡️ Горизонтальные полосы:</strong>{' '}
                Уничтожают всю строку.
                <br />
                <strong>⬆️⬇️ Вертикальные полосы:</strong> Уничтожают
                весь столбец.
                <br />
                Все уничтоженные блоки засчитываются к очкам!
            </StyledInstructions>

            <ScoreGuide />

            <GameHUD
                score={gameState.score}
                selectedCount={gameState.selectedBlocks.length}
                onReset={resetGame}
            />

            <GameGrid
                grid={gameState.grid}
                onBlockMouseDown={handleBlockMouseDown}
                onBlockMouseEnter={handleBlockMouseEnter}
                onMouseUp={handleMouseUp}
                onDoubleClick={handleDoubleClick}
            />

            <SelectionInfo
                selectedBlocks={gameState.selectedBlocks}
                isDragging={gameState.isDragging}
                pendingConfirmation={gameState.pendingConfirmation}
                onConfirm={confirmSelection}
                onCancel={cancelPendingSelection}
            />
        </StyledGameContainer>
    )
}
