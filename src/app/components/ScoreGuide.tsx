import styled from 'styled-components'

import type { Color } from '@shared/types/game'
import { SCORE_MULTIPLIERS } from '@shared/utils/gameUtils'

const StyledGuide = styled.div`
    background: linear-gradient(135deg, #636e72 0%, #2d3436 100%);
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

    /* Адаптивный гид */
    @media (max-width: 768px) {
        padding: 14px;
        border-radius: 10px;
        margin-bottom: 16px;
    }

    @media (max-width: 480px) {
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 12px;
    }

    @media (max-width: 360px) {
        padding: 10px;
        margin-bottom: 10px;
    }
`

const StyledTitle = styled.h3`
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 12px;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 1px;

    /* Адаптивный заголовок */
    @media (max-width: 768px) {
        font-size: 15px;
        margin-bottom: 10px;
        letter-spacing: 0.8px;
    }

    @media (max-width: 480px) {
        font-size: 14px;
        margin-bottom: 8px;
        letter-spacing: 0.5px;
    }

    @media (max-width: 360px) {
        font-size: 13px;
        margin-bottom: 6px;
        letter-spacing: 0.3px;
    }
`

const StyledColorList = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 8px;

    /* Адаптивный список цветов */
    @media (max-width: 768px) {
        gap: 6px;
    }

    @media (max-width: 480px) {
        gap: 4px;
    }

    @media (max-width: 360px) {
        gap: 2px;
        flex-wrap: wrap;
        justify-content: center;
    }
`

const StyledColorItem = styled.div<{ $color: Color }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    flex: 1;

    /* Адаптивные элементы цвета */
    @media (max-width: 768px) {
        gap: 3px;
    }

    @media (max-width: 480px) {
        gap: 2px;
    }

    @media (max-width: 360px) {
        gap: 1px;
        min-width: 70px;
        max-width: 80px;
    }
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

    /* Адаптивные цветные блоки */
    @media (max-width: 768px) {
        width: 22px;
        height: 22px;
        border-radius: 5px;
    }

    @media (max-width: 480px) {
        width: 20px;
        height: 20px;
        border-radius: 4px;
        border-width: 1.5px;
    }

    @media (max-width: 360px) {
        width: 18px;
        height: 18px;
        border-radius: 3px;
        border-width: 1px;
    }
`

const StyledScore = styled.div`
    color: #fff;
    font-size: 14px;
    font-weight: bold;

    /* Адаптивные очки */
    @media (max-width: 768px) {
        font-size: 13px;
    }

    @media (max-width: 480px) {
        font-size: 12px;
    }

    @media (max-width: 360px) {
        font-size: 11px;
    }
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
    text-align: center;

    /* Адаптивная редкость */
    @media (max-width: 768px) {
        font-size: 9px;
        letter-spacing: 0.3px;
    }

    @media (max-width: 480px) {
        font-size: 8px;
        letter-spacing: 0.2px;
    }

    @media (max-width: 360px) {
        font-size: 7px;
        letter-spacing: 0.1px;
        line-height: 1.2;
    }
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
