import styled, { css, keyframes } from 'styled-components'

import type { BlockType, Color } from '@shared/types/game'

type GameBlockProps = {
    block: BlockType
    onMouseDown: (block: BlockType) => void
    onMouseEnter: (block: BlockType) => void
    onMouseUp: () => void
    onTouchStart?: (block: BlockType) => void
    onTouchMove?: (event: React.TouchEvent, block: BlockType) => void
    onTouchEnd?: () => void
}

type StyledBlockProps = {
    $color: Color
    $isSelected: boolean
    $isNew: boolean
    $animationDelay: number
    $hasBomb: boolean
    $hasHorizontalStripe: boolean
    $hasVerticalStripe: boolean
    $isExploding: boolean
    $explosionDelay: number
}

const colorMap: Record<Color, string> = {
    red: '#e74c3c',
    blue: '#3498db',
    green: '#27ae60',
    purple: '#9b59b6',
}

// Анимация падения блока сверху
const dropIn = keyframes`
    0% {
        transform: translateY(-100px);
        opacity: 0;
    }
    100% {
        transform: translateY(0);
        opacity: 1;
    }
`

// Анимация взрыва
const explode = keyframes`
    0% {
        transform: scale(1);
        opacity: 1;
        background-color: inherit;
    }
    50% {
        transform: scale(1.5);
        opacity: 0.8;
        background-color: #ff6b35;
        box-shadow: 0 0 30px #ff6b35, 0 0 60px #ff6b35;
    }
    100% {
        transform: scale(2);
        opacity: 0;
        background-color: #ffed4e;
        box-shadow: 0 0 40px #ffed4e, 0 0 80px #ffed4e;
    }
`

const StyledBlock = styled.div<StyledBlockProps>`
    width: 50px;
    height: 50px;
    background-color: ${({ $color }) => colorMap[$color]};
    border: 2px solid
        ${({
            $isSelected,
            $hasBomb,
            $hasHorizontalStripe,
            $hasVerticalStripe,
        }) => {
            if ($isSelected) return '#fff' // белая рамка для выделения всегда приоритетнее
            if ($hasBomb) return '#ff6b35' // оранжевая рамка для бомбы
            if ($hasHorizontalStripe) return '#00b894' // зеленая рамка для горизонтальной полосы
            if ($hasVerticalStripe) return '#0984e3' // синяя рамка для вертикальной полосы
            return 'transparent' // прозрачная рамка для обычных блоков
        }};
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    position: relative;
    overflow: hidden;
    box-shadow: ${({
        $isSelected,
        $hasBomb,
        $hasHorizontalStripe,
        $hasVerticalStripe,
    }) => {
        if ($isSelected) return '0 0 15px rgba(255, 255, 255, 0.8)'
        if ($hasBomb)
            return '0 0 10px rgba(255, 107, 53, 0.3), inset 0 0 10px rgba(255, 107, 53, 0.1)'
        if ($hasHorizontalStripe)
            return '0 0 10px rgba(0, 184, 148, 0.3), inset 0 0 10px rgba(0, 184, 148, 0.1)'
        if ($hasVerticalStripe)
            return '0 0 10px rgba(9, 132, 227, 0.3), inset 0 0 10px rgba(9, 132, 227, 0.1)'
        return '0 2px 4px rgba(0, 0, 0, 0.1)'
    }};

    /* Увеличиваем размер на мобильных для лучшего touch-взаимодействия */
    @media (max-width: 768px) {
        width: 60px;
        height: 60px;
        border-radius: 10px;
    }

    /* Анимация падения для новых блоков */
    ${({ $isNew, $animationDelay }) =>
        $isNew &&
        css`
            animation: ${dropIn} 0.5s ease-out;
            animation-delay: ${$animationDelay}s;
            animation-fill-mode: both;
        `}

    /* Анимация взрыва с задержкой для цепных реакций */
    ${({ $isExploding, $explosionDelay }) =>
        $isExploding &&
        css`
            animation: ${explode} 0.8s ease-out forwards;
            animation-delay: ${$explosionDelay}s;
            z-index: 10;
        `}

    /* Иконки специальных блоков */
    ${({ $hasBomb, $hasHorizontalStripe, $hasVerticalStripe }) =>
        ($hasBomb || $hasHorizontalStripe || $hasVerticalStripe) &&
        css`
            &::before {
                content: ${$hasBomb
                    ? "'💣'"
                    : $hasHorizontalStripe
                      ? "'⬅️➡️'"
                      : $hasVerticalStripe
                        ? "'⬆️⬇️'"
                        : "''"};
                position: absolute;
                top: 2px;
                right: 2px;
                font-size: ${$hasBomb ? '12px' : '10px'};
                z-index: 5;
                text-shadow: 0 0 3px rgba(0, 0, 0, 0.8);

                /* Увеличиваем иконки на мобильных */
                @media (max-width: 768px) {
                    font-size: ${$hasBomb ? '14px' : '12px'};
                    top: 3px;
                    right: 3px;
                }
            }
        `}

    /* Выделенные блоки со специальными эффектами */
    ${({ $isSelected, $hasBomb }) =>
        $isSelected &&
        $hasBomb &&
        css`
            box-shadow:
                0 0 15px rgba(255, 255, 255, 0.8),
                0 0 25px rgba(255, 107, 53, 0.6) !important;
            border: 2px solid #fff !important;
        `}

    ${({ $isSelected, $hasHorizontalStripe }) =>
        $isSelected &&
        $hasHorizontalStripe &&
        css`
            box-shadow:
                0 0 15px rgba(255, 255, 255, 0.8),
                0 0 25px rgba(0, 184, 148, 0.6) !important;
            border: 2px solid #fff !important;
        `}

    ${({ $isSelected, $hasVerticalStripe }) =>
        $isSelected &&
        $hasVerticalStripe &&
        css`
            box-shadow:
                0 0 15px rgba(255, 255, 255, 0.8),
                0 0 25px rgba(9, 132, 227, 0.6) !important;
            border: 2px solid #fff !important;
        `}

    &:hover {
        transform: ${({ $isExploding }) =>
            $isExploding ? 'none' : 'scale(1.05)'};
        box-shadow: ${({ $isExploding }) =>
            $isExploding
                ? 'inherit'
                : '0 4px 8px rgba(0, 0, 0, 0.2)'};
    }

    &:active {
        transform: ${({ $isExploding }) =>
            $isExploding ? 'none' : 'scale(0.95)'};
    }
`

export const GameBlock = ({
    block,
    onMouseDown,
    onMouseEnter,
    onMouseUp,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
}: GameBlockProps) => {
    const handleTouchStart = (e: React.TouchEvent) => {
        e.preventDefault() // Предотвращаем скролл
        if (onTouchStart) {
            onTouchStart(block)
        }
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        e.preventDefault() // Предотвращаем скролл
        if (onTouchMove) {
            onTouchMove(e, block)
        }
    }

    const handleTouchEnd = (e: React.TouchEvent) => {
        e.preventDefault() // Предотвращаем скролл
        if (onTouchEnd) {
            onTouchEnd()
        }
    }

    return (
        <StyledBlock
            $color={block.color}
            $isSelected={block.isSelected}
            $isNew={block.isNew || false}
            $animationDelay={block.animationDelay || 0}
            $hasBomb={block.hasBomb || false}
            $hasHorizontalStripe={block.hasHorizontalStripe || false}
            $hasVerticalStripe={block.hasVerticalStripe || false}
            $isExploding={block.isExploding || false}
            $explosionDelay={block.explosionDelay || 0}
            onMouseDown={() => onMouseDown(block)}
            onMouseEnter={() => onMouseEnter(block)}
            onMouseUp={onMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        />
    )
}
