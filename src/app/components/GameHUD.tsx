import styled from 'styled-components'

type GameHUDProps = {
    score: number
    confirmSelection: () => void
    onReset: () => void
}

const StyledHUD = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    background: linear-gradient(135deg, #2d3436 0%, #636e72 100%);
    border-radius: 12px;
    margin-bottom: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

    /* Адаптивный макет для мобильных */
    @media (max-width: 768px) {
        // flex-direction: column;
        gap: 16px;
        padding: 16px 20px;
        border-radius: 10px;
    }

    @media (max-width: 480px) {
        padding: 12px 16px;
        gap: 12px;
        margin-bottom: 16px;
        border-radius: 8px;
    }
`

const StyledScoreSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    @media (max-width: 768px) {
        align-items: center;
        width: 100%;
    }
`

const StyledScore = styled.div`
    font-size: 28px;
    font-weight: bold;
    color: #fff;
    margin-bottom: 4px;

    @media (max-width: 768px) {
        font-size: 32px;
    }

    @media (max-width: 480px) {
        font-size: 28px;
    }

    @media (max-width: 360px) {
        font-size: 24px;
    }
`

const StyledLabel = styled.div`
    font-size: 14px;
    color: #b2bec3;
    text-transform: uppercase;
    letter-spacing: 1px;

    @media (max-width: 480px) {
        font-size: 13px;
        letter-spacing: 0.5px;
    }
`

const StyledResetButton = styled.button`
    background: linear-gradient(135deg, #e17055 0%, #d63031 100%);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s ease;
    text-transform: uppercase;
    letter-spacing: 1px;
    min-height: 44px;

    /* Адаптивная кнопка для мобильных */
    @media (max-width: 768px) {
        padding: 14px 28px;
        font-size: 16px;
        min-height: 48px;
        width: auto;
    }

    @media (max-width: 480px) {
        padding: 12px 20px;
        font-size: 15px;
        width: 100%;
        min-height: 44px;
        letter-spacing: 0.5px;
    }

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(214, 48, 49, 0.4);
    }

    &:active {
        transform: translateY(0);
    }

    /* Убираем hover эффекты на мобильных touch устройствах */
    @media (hover: none) and (pointer: coarse) {
        &:hover {
            transform: none;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
    }
`

export const GameHUD = ({
    score,
    // confirmSelection,
    onReset,
}: GameHUDProps) => {
    return (
        <StyledHUD>
            <StyledScoreSection>
                <StyledScore>{score}</StyledScore>
                <StyledLabel>Очки</StyledLabel>
            </StyledScoreSection>

            {/* <StyledSelection onClick={confirmSelection}>
                <StyledSelectedCount>
                    нанести урон
                </StyledSelectedCount>
            </StyledSelection> */}

            <StyledResetButton onClick={onReset}>
                Новая игра
            </StyledResetButton>
        </StyledHUD>
    )
}
