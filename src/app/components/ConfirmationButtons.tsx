import styled from 'styled-components'

import type { BlockType } from '@shared/types/game'
import { calculateScore } from '@shared/utils/gameUtils'

type ConfirmationButtonsProps = {
    selectedBlocks: BlockType[]
    onConfirm: () => void
    onCancel: () => void
}

const StyledButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 16px;
    padding: 16px;
    background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
    border-radius: 12px;
    margin-bottom: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`

const StyledInfo = styled.div`
    text-align: center;
    margin-bottom: 12px;
    color: white;
    font-weight: bold;
`

const StyledButton = styled.button<{
    $variant: 'confirm' | 'cancel'
}>`
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s ease;
    text-transform: uppercase;
    letter-spacing: 1px;
    min-width: 120px;

    ${({ $variant }) =>
        $variant === 'confirm'
            ? `
        background: linear-gradient(135deg, #00b894 0%, #00a085 100%);
        color: white;
        
        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0, 184, 148, 0.4);
        }
    `
            : `
        background: linear-gradient(135deg, #e17055 0%, #d63031 100%);
        color: white;
        
        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(214, 48, 49, 0.4);
        }
    `}

    &:active {
        transform: translateY(0);
    }
`

export const ConfirmationButtons = ({
    selectedBlocks,
    onConfirm,
    onCancel,
}: ConfirmationButtonsProps) => {
    const score = calculateScore(selectedBlocks)
    const count = selectedBlocks.length

    return (
        <StyledButtonContainer>
            <div>
                <StyledInfo>
                    Выбрано {count} блок
                    {count === 1 ? '' : count < 5 ? 'а' : 'ов'} •
                    Получите {score} очк
                    {score === 1 ? 'о' : score < 5 ? 'а' : 'ов'}
                </StyledInfo>
                <div style={{ display: 'flex', gap: '16px' }}>
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
                </div>
            </div>
        </StyledButtonContainer>
    )
}
