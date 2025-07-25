import styled from 'styled-components'

import { useRef } from 'react'

import type { BlockType } from '@shared/types/game'

import { GameBlock } from './GameBlock'

type GameGridProps = {
    grid: BlockType[][]
    onBlockMouseDown: (block: BlockType) => void
    onBlockMouseEnter: (block: BlockType) => void
    onMouseUp: () => void
    onDoubleClick?: () => void
}

type StyledGridProps = {
    $gridSize: number
}

const StyledGrid = styled.div<StyledGridProps>`
    display: grid;
    grid-template-columns: repeat(
        ${({ $gridSize }) => $gridSize},
        1fr
    );
    grid-template-rows: repeat(${({ $gridSize }) => $gridSize}, 1fr);
    gap: 4px;
    padding: 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    user-select: none;
    touch-action: none; /* Предотвращаем скролл на touch устройствах */

    /* Увеличиваем размер на мобильных для лучшего touch-взаимодействия */
    @media (max-width: 768px) {
        gap: 6px;
        padding: 20px;
    }
`

const StyledGridContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`

export const GameGrid = ({
    grid,
    onBlockMouseDown,
    onBlockMouseEnter,
    onMouseUp,
    onDoubleClick,
}: GameGridProps) => {
    const gridRef = useRef<HTMLDivElement>(null)

    // Функция для определения блока под координатами touch
    const getBlockFromTouchPoint = (
        clientX: number,
        clientY: number
    ): BlockType | null => {
        const element = document.elementFromPoint(clientX, clientY)
        if (!element) return null

        // Ищем ближайший блок
        const blockElement = element.closest(
            '[data-block-id]'
        ) as HTMLElement
        if (!blockElement) return null

        const blockId = blockElement.getAttribute('data-block-id')
        if (!blockId) return null

        // Находим блок в сетке по ID
        for (const row of grid) {
            for (const block of row) {
                if (block.id === blockId) {
                    return block
                }
            }
        }
        return null
    }

    const handleTouchStart = (block: BlockType) => {
        onBlockMouseDown(block)
    }

    const handleTouchMove = (
        event: React.TouchEvent,
        currentBlock: BlockType
    ) => {
        const touch = event.touches[0]
        if (!touch) return

        const blockUnderTouch = getBlockFromTouchPoint(
            touch.clientX,
            touch.clientY
        )
        if (
            blockUnderTouch &&
            blockUnderTouch.id !== currentBlock.id
        ) {
            onBlockMouseEnter(blockUnderTouch)
        }
    }

    const handleTouchEnd = () => {
        onMouseUp()
    }

    return (
        <StyledGridContainer>
            <StyledGrid
                ref={gridRef}
                $gridSize={grid.length}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp} // Завершаем выделение при уходе с сетки
                onDoubleClick={onDoubleClick}
            >
                {grid.flat().map((block) => (
                    <div key={block.id} data-block-id={block.id}>
                        <GameBlock
                            block={block}
                            onMouseDown={onBlockMouseDown}
                            onMouseEnter={onBlockMouseEnter}
                            onMouseUp={onMouseUp}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                        />
                    </div>
                ))}
            </StyledGrid>
        </StyledGridContainer>
    )
}
