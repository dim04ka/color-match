import styled from 'styled-components'

import type { BlockType } from '@shared/types/game'
import { calculateScore } from '@shared/utils/gameUtils'

type SelectionInfoProps = {
    selectedBlocks: BlockType[]
    isDragging: boolean
    pendingConfirmation: boolean
    onConfirm?: () => void
    onCancel?: () => void
}

const StyledContainer = styled.div`
    background: linear-gradient(135deg, #636e72 0%, #2d3436 100%);
    border-radius: 12px;
    padding: 16px;
    margin-top: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    min-height: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;

    /* Адаптивный контейнер */
    @media (max-width: 768px) {
        padding: 14px;
        margin-top: 16px;
        border-radius: 10px;
        min-height: 55px;
    }

    @media (max-width: 480px) {
        padding: 12px;
        margin-top: 12px;
        border-radius: 8px;
        min-height: 50px;
        gap: 10px;
    }

    @media (max-width: 360px) {
        padding: 10px;
        margin-top: 10px;
        min-height: 45px;
        gap: 8px;
    }
`

const StyledInfo = styled.div<{ $visible: boolean }>`
    display: flex;
    align-items: center;
    gap: 16px;
    color: white;
    font-weight: bold;
    opacity: ${({ $visible }) => ($visible ? 1 : 0.5)};
    transition: opacity 0.2s ease;
    flex-wrap: wrap;
    justify-content: center;

    /* Адаптивное расположение информации */
    @media (max-width: 768px) {
        gap: 12px;
    }

    @media (max-width: 480px) {
        gap: 8px;
        flex-direction: column;
        width: 100%;
    }

    @media (max-width: 360px) {
        gap: 6px;
    }
`

const StyledBadge = styled.div<{
    $variant: 'blocks' | 'score' | 'status'
}>`
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: bold;
    white-space: nowrap;

    /* Адаптивные бейджи */
    @media (max-width: 768px) {
        padding: 7px 10px;
        font-size: 13px;
        gap: 5px;
    }

    @media (max-width: 480px) {
        padding: 6px 8px;
        font-size: 12px;
        gap: 4px;
        flex: 1;
        justify-content: center;
        border-radius: 16px;
    }

    @media (max-width: 360px) {
        padding: 5px 6px;
        font-size: 11px;
        gap: 3px;
        border-radius: 12px;
    }

    ${({ $variant }) => {
        switch ($variant) {
            case 'blocks':
                return `
                    background: rgba(116, 185, 255, 0.3);
                    color: #74b9ff;
                `
            case 'score':
                return `
                    background: rgba(0, 184, 148, 0.3);
                    color: #00b894;
                `
            case 'status':
                return `
                    background: rgba(253, 203, 110, 0.3);
                    color: #fdcb6e;
                `
        }
    }}
`

const StyledButtons = styled.div`
    display: flex;
    gap: 12px;

    /* Адаптивные кнопки */
    @media (max-width: 480px) {
        gap: 8px;
        width: 100%;
    }
`

const StyledButton = styled.button<{
    $variant: 'confirm' | 'cancel'
}>`
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s ease;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    min-height: 36px;

    /* Адаптивные кнопки */
    @media (max-width: 768px) {
        padding: 9px 18px;
        font-size: 14px;
        min-height: 40px;
    }

    @media (max-width: 480px) {
        padding: 8px 14px;
        font-size: 13px;
        min-height: 36px;
        flex: 1;
        letter-spacing: 0.3px;
    }

    @media (max-width: 360px) {
        padding: 6px 10px;
        font-size: 12px;
        min-height: 32px;
        letter-spacing: 0.2px;
    }

    ${({ $variant }) =>
        $variant === 'confirm'
            ? `
        background: linear-gradient(135deg, #00b894 0%, #00a085 100%);
        color: white;
        
        &:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 184, 148, 0.4);
        }
    `
            : `
        background: linear-gradient(135deg, #e17055 0%, #d63031 100%);
        color: white;
        
        &:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(214, 48, 49, 0.4);
        }
    `}

    &:active {
        transform: translateY(0);
    }

    /* Убираем hover эффекты на мобильных touch устройствах */
    @media (hover: none) and (pointer: coarse) {
        &:hover {
            transform: none;
            box-shadow: none;
        }
    }
`

export const SelectionInfo = ({
    selectedBlocks,
    isDragging,
    pendingConfirmation,
    onConfirm,
    onCancel,
}: SelectionInfoProps) => {
    const count = selectedBlocks.length
    const score = calculateScore(selectedBlocks)
    const hasSelection = count > 0

    const getStatusText = () => {
        if (isDragging) return 'Выделение...'
        if (pendingConfirmation) return 'Ожидает подтверждения'
        if (hasSelection) return 'Выбор отменен'
        return 'Нет выбора'
    }

    return (
        <StyledContainer>
            <StyledInfo $visible={hasSelection}>
                <StyledBadge $variant="blocks">
                    📦 {count} блок
                    {count === 1 ? '' : count < 5 ? 'а' : 'ов'}
                </StyledBadge>

                <StyledBadge $variant="score">
                    ⭐ {score} очк
                    {score === 1 ? 'о' : score < 5 ? 'а' : 'ов'}
                </StyledBadge>

                <StyledBadge $variant="status">
                    {getStatusText()}
                </StyledBadge>
            </StyledInfo>

            {pendingConfirmation && onConfirm && onCancel && (
                <StyledButtons>
                    <StyledButton
                        $variant="confirm"
                        onClick={onConfirm}
                    >
                        Подтвердить
                    </StyledButton>
                    <StyledButton
                        $variant="cancel"
                        onClick={onCancel}
                    >
                        Отменить
                    </StyledButton>
                </StyledButtons>
            )}
        </StyledContainer>
    )
}
