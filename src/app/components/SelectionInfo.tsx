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
`

const StyledInfo = styled.div<{ $visible: boolean }>`
    display: flex;
    align-items: center;
    gap: 16px;
    color: white;
    font-weight: bold;
    opacity: ${({ $visible }) => ($visible ? 1 : 0.5)};
    transition: opacity 0.2s ease;
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
