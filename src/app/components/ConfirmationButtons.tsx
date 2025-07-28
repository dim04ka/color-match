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

    /* Адаптивный контейнер для мобильных */
    @media (max-width: 768px) {
        padding: 14px;
        border-radius: 10px;
        margin-bottom: 16px;
    }

    @media (max-width: 480px) {
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 12px;
        gap: 12px;
    }
`

const StyledInfo = styled.div`
    text-align: center;
    margin-bottom: 12px;
    color: white;
    font-weight: bold;

    /* Адаптивная информация */
    @media (max-width: 768px) {
        font-size: 15px;
        margin-bottom: 10px;
    }

    @media (max-width: 480px) {
        font-size: 14px;
        margin-bottom: 8px;
        line-height: 1.3;
    }

    @media (max-width: 360px) {
        font-size: 13px;
        margin-bottom: 6px;
    }
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
    min-height: 44px;

    /* Адаптивные кнопки */
    @media (max-width: 768px) {
        padding: 14px 28px;
        font-size: 16px;
        min-width: 130px;
        min-height: 48px;
    }

    @media (max-width: 480px) {
        padding: 12px 20px;
        font-size: 15px;
        min-width: 110px;
        min-height: 44px;
        letter-spacing: 0.5px;
        flex: 1;
    }

    @media (max-width: 360px) {
        padding: 10px 16px;
        font-size: 14px;
        min-width: 90px;
        min-height: 40px;
        letter-spacing: 0.3px;
    }

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

    /* Убираем hover эффекты на мобильных touch устройствах */
    @media (hover: none) and (pointer: coarse) {
        &:hover {
            transform: none;
            box-shadow: none;
        }
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
                <div
                    style={{
                        display: 'flex',
                        gap: '16px',
                        width: '100%',
                    }}
                >
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
