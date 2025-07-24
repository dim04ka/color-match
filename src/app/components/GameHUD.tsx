import styled from 'styled-components'

type GameHUDProps = {
    score: number
    selectedCount: number
    onReset: () => void
}

const StyledHUD = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    background: linear-gradient(135deg, #2d3436 0%, #636e72 100%);
    border-radius: 12px;
    margin-bottom: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`

const StyledScoreSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`

const StyledScore = styled.div`
    font-size: 28px;
    font-weight: bold;
    color: #fff;
    margin-bottom: 4px;
`

const StyledLabel = styled.div`
    font-size: 14px;
    color: #b2bec3;
    text-transform: uppercase;
    letter-spacing: 1px;
`

const StyledSelection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`

const StyledSelectedCount = styled.div`
    font-size: 24px;
    font-weight: bold;
    color: #00b894;
    margin-bottom: 4px;
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

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(214, 48, 49, 0.4);
    }

    &:active {
        transform: translateY(0);
    }
`

export const GameHUD = ({
    score,
    selectedCount,
    onReset,
}: GameHUDProps) => {
    return (
        <StyledHUD>
            <StyledScoreSection>
                <StyledScore>{score}</StyledScore>
                <StyledLabel>Очки</StyledLabel>
            </StyledScoreSection>

            <StyledSelection>
                <StyledSelectedCount>
                    {selectedCount}
                </StyledSelectedCount>
                <StyledLabel>Выбрано</StyledLabel>
            </StyledSelection>

            <StyledResetButton onClick={onReset}>
                Новая игра
            </StyledResetButton>
        </StyledHUD>
    )
}
