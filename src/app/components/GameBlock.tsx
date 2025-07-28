import styled, { css } from 'styled-components'

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

    /* Адаптивные размеры блоков */
    @media (max-width: 768px) {
        width: 45px;
        height: 45px;
        border-radius: 6px;
    }

    @media (max-width: 480px) {
        width: 38px;
        height: 38px;
        border-radius: 5px;
        border-width: 1.5px;
    }

    @media (max-width: 360px) {
        width: 32px;
        height: 32px;
        border-radius: 4px;
        border-width: 1px;
    }

    /* Анимация появления новых блоков и падения существующих */
    ${({ $isNew, $animationDelay }) =>
        $isNew &&
        css`
            animation: ${$animationDelay === 0.05
                    ? 'dropDown'
                    : 'dropIn'}
                0.4s ease-out forwards;
            animation-delay: ${$animationDelay === 0.05
                ? '0s'
                : `${$animationDelay}s`};
            transform: ${$animationDelay === 0.05
                ? 'translateY(-20px)'
                : 'translateY(-100px)'};
            opacity: ${$animationDelay === 0.05 ? '1' : '0'};

            @keyframes dropIn {
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }

            @keyframes dropDown {
                to {
                    transform: translateY(0);
                }
            }
        `}

    /* Анимация взрыва */
    ${({ $isExploding, $explosionDelay }) =>
        $isExploding &&
        css`
            animation: explode 0.8s ease-out forwards;
            animation-delay: ${$explosionDelay}s;

            @keyframes explode {
                0% {
                    transform: scale(1);
                    opacity: 1;
                }
                50% {
                    transform: scale(1.3);
                    opacity: 0.8;
                }
                100% {
                    transform: scale(0);
                    opacity: 0;
                }
            }
        `}

    /* Стили для специальных блоков при выделении */
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

                /* Адаптивные размеры иконок */
                @media (max-width: 768px) {
                    font-size: ${$hasBomb ? '11px' : '9px'};
                    top: 2px;
                    right: 2px;
                }

                @media (max-width: 480px) {
                    font-size: ${$hasBomb ? '10px' : '8px'};
                    top: 1px;
                    right: 1px;
                }

                @media (max-width: 360px) {
                    font-size: ${$hasBomb ? '9px' : '7px'};
                    top: 1px;
                    right: 1px;
                }
            }
        `}

    /* Убираем hover эффекты на мобильных touch устройствах */
    @media (hover: none) and (pointer: coarse) {
        &:hover {
            transform: none;
            box-shadow: ${({
                $isSelected,
                $hasBomb,
                $hasHorizontalStripe,
                $hasVerticalStripe,
            }) => {
                if ($isSelected)
                    return '0 0 15px rgba(255, 255, 255, 0.8)'
                if ($hasBomb)
                    return '0 0 10px rgba(255, 107, 53, 0.3), inset 0 0 10px rgba(255, 107, 53, 0.1)'
                if ($hasHorizontalStripe)
                    return '0 0 10px rgba(0, 184, 148, 0.3), inset 0 0 10px rgba(0, 184, 148, 0.1)'
                if ($hasVerticalStripe)
                    return '0 0 10px rgba(9, 132, 227, 0.3), inset 0 0 10px rgba(9, 132, 227, 0.1)'
                return '0 2px 4px rgba(0, 0, 0, 0.1)'
            }};
        }
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
