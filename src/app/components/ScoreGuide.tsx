import styled from 'styled-components'

import type { Color } from '@shared/types/game'
import { SCORE_MULTIPLIERS } from '@shared/utils/gameUtils'

const StyledGuide = styled.div`
    background: linear-gradient(135deg, #636e72 0%, #2d3436 100%);
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`

const StyledTitle = styled.h3`
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 12px;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 1px;
`

const StyledColorList = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 8px;
`

const StyledColorItem = styled.div<{ $color: Color }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    flex: 1;
`

const StyledColorBlock = styled.div<{ $color: Color }>`
    width: 24px;
    height: 24px;
    border-radius: 6px;
    background-color: ${({ $color }) => {
        const colorMap = {
            red: '#e74c3c',
            blue: '#3498db',
            green: '#27ae60',
            purple: '#9b59b6',
        }
        return colorMap[$color]
    }};
    border: 2px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`

const StyledScore = styled.div`
    color: #fff;
    font-size: 14px;
    font-weight: bold;
`

const StyledRarity = styled.div<{ $color: Color }>`
    color: ${({ $color }) => {
        const rarityColors = {
            blue: '#00b894',
            red: '#fdcb6e',
            green: '#fd79a8',
            purple: '#e84393',
        }
        return rarityColors[$color]
    }};
    font-size: 10px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.5px;
`

export const ScoreGuide = () => {
    const colorOrder: Color[] = ['blue', 'red', 'green', 'purple']
    const rarityLabels = {
        blue: 'Частый',
        red: 'Средний',
        green: 'Редкий',
        purple: 'Очень редкий',
    }

    return (
        <StyledGuide>
            <StyledTitle>Стоимость блоков</StyledTitle>
            <StyledColorList>
                {colorOrder.map((color) => (
                    <StyledColorItem key={color} $color={color}>
                        <StyledColorBlock $color={color} />
                        <StyledScore>
                            {SCORE_MULTIPLIERS[color]} очк.
                        </StyledScore>
                        <StyledRarity $color={color}>
                            {rarityLabels[color]}
                        </StyledRarity>
                    </StyledColorItem>
                ))}
            </StyledColorList>
        </StyledGuide>
    )
}
