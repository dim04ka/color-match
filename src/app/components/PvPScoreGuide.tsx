import styled from 'styled-components'

import React, { useEffect, useState } from 'react'

import { useAppContext } from '@app/contexts/AppContext'
import type {
    Color,
    PlayerDamageInfo,
    PlayerInfo,
} from '@shared/types/game'
import { SCORE_MULTIPLIERS } from '@shared/utils/gameUtils'
import { getTranslation } from '@shared/utils/translations'

const StyledGuide = styled.div`
    background: linear-gradient(135deg, #636e72 0%, #2d3436 100%);
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

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

const StyledContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;

    @media (max-width: 768px) {
        gap: 14px;
    }

    @media (max-width: 480px) {
        gap: 12px;
    }
`

const StyledPlayersSection = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;

    @media (max-width: 480px) {
        gap: 12px;
    }
`

const StyledPlayerCard = styled.div<{ $isActive: boolean }>`
    display: flex;
    align-items: center;
    gap: 12px;
    background: ${({ $isActive }) =>
        $isActive
            ? 'rgba(255, 215, 0, 0.2)'
            : 'rgba(255, 255, 255, 0.1)'};
    border: 2px solid
        ${({ $isActive }) =>
            $isActive ? '#ffd700' : 'rgba(255, 255, 255, 0.2)'};
    border-radius: 8px;
    padding: 8px 12px;
    flex: 1;
    transition: all 0.3s ease;

    ${({ $isActive }) =>
        $isActive &&
        `
        box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
    `}

    @media (max-width: 768px) {
        gap: 10px;
        padding: 6px 10px;
    }

    @media (max-width: 480px) {
        gap: 8px;
        padding: 6px 8px;
        max-width: 200px;
        justify-content: center;
    }
`

const StyledPlayerIcon = styled.div`
    font-size: 1.5rem;
    position: relative;

    @media (max-width: 768px) {
        font-size: 1.3rem;
    }

    @media (max-width: 480px) {
        font-size: 1.2rem;
    }
`

const StyledDamageIndicator = styled.div`
    position: absolute;
    top: -8px;
    right: -12px;
    background: linear-gradient(135deg, #e74c3c, #c0392b);
    color: white;
    border-radius: 50%;
    min-width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    font-weight: bold;
    animation:
        damageAppear 0.6s ease-out forwards,
        damageDisappear 0.3s ease-in 2.7s forwards;
    box-shadow: 0 2px 4px rgba(231, 76, 60, 0.4);
    z-index: 10;

    @keyframes damageAppear {
        0% {
            transform: scale(0) translateY(10px);
            opacity: 0;
        }
        50% {
            transform: scale(1.2) translateY(-5px);
            opacity: 1;
        }
        100% {
            transform: scale(1) translateY(0);
            opacity: 1;
        }
    }

    @keyframes damageDisappear {
        0% {
            transform: scale(1);
            opacity: 1;
        }
        100% {
            transform: scale(0.8);
            opacity: 0;
        }
    }

    @media (max-width: 768px) {
        min-width: 20px;
        height: 20px;
        font-size: 0.6rem;
        top: -6px;
        right: -10px;
    }

    @media (max-width: 480px) {
        min-width: 18px;
        height: 18px;
        font-size: 0.55rem;
        top: -5px;
        right: -8px;
    }
`

const StyledPlayerInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
`

const StyledPlayerName = styled.div`
    color: white;
    font-size: 0.9rem;
    font-weight: bold;

    @media (max-width: 768px) {
        font-size: 0.8rem;
    }
`

const StyledHpContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    width: 100%;
`

const StyledHpBar = styled.div`
    flex: 1;
    height: 6px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
    overflow: hidden;

    @media (max-width: 480px) {
        height: 5px;
    }
`

const StyledHpFill = styled.div<{ $percentage: number }>`
    width: ${({ $percentage }) => $percentage}%;
    height: 100%;
    background: ${({ $percentage }) => {
        if ($percentage > 60) return '#4caf50'
        if ($percentage > 30) return '#ff9800'
        return '#f44336'
    }};
    transition: all 0.3s ease;
`

const StyledHpText = styled.div`
    color: white;
    font-size: 0.7rem;
    font-weight: bold;
    white-space: nowrap;

    @media (max-width: 768px) {
        font-size: 0.6rem;
    }
`

const StyledTurnIndicator = styled.div`
    background: #ffd700;
    color: #333;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.6rem;
    font-weight: bold;
    white-space: nowrap;

    @media (max-width: 480px) {
        font-size: 0.5rem;
        padding: 1px 4px;
    }
`

const StyledTimerSection = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.1);
    padding: 8px 16px;
    border-radius: 8px;
    border: 2px solid rgba(255, 255, 255, 0.2);

    @media (max-width: 480px) {
        gap: 6px;
        padding: 6px 12px;
    }
`

const StyledTimerText = styled.div`
    color: white;
    font-size: 0.8rem;
    font-weight: bold;

    @media (max-width: 768px) {
        font-size: 0.7rem;
    }

    @media (max-width: 480px) {
        font-size: 0.6rem;
    }
`

const StyledTimerValue = styled.div<{ $isWarning: boolean }>`
    color: ${({ $isWarning }) =>
        $isWarning ? '#ff6b6b' : '#4caf50'};
    font-size: 1.2rem;
    font-weight: bold;
    font-family: monospace;
    min-width: 60px;
    text-align: center;
    background: rgba(0, 0, 0, 0.3);
    padding: 4px 8px;
    border-radius: 4px;
    transition: color 0.3s ease;

    ${({ $isWarning }) =>
        $isWarning &&
        `
        animation: pulse 1s infinite;
    `}

    @keyframes pulse {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0.7;
        }
    }

    @media (max-width: 768px) {
        font-size: 1rem;
        min-width: 50px;
        padding: 3px 6px;
    }

    @media (max-width: 480px) {
        font-size: 0.9rem;
        min-width: 45px;
        padding: 2px 4px;
    }
`

const StyledDivider = styled.div`
    height: 1px;
    background: rgba(255, 255, 255, 0.2);
    margin: 4px 0;
`

const StyledTitle = styled.h3`
    color: #fff;
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 8px;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 1px;

    @media (max-width: 768px) {
        font-size: 13px;
        margin-bottom: 6px;
        letter-spacing: 0.8px;
    }

    @media (max-width: 480px) {
        font-size: 12px;
        margin-bottom: 6px;
        letter-spacing: 0.5px;
    }
`

const StyledColorList = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    flex: 1;
    justify-content: space-between;
    gap: 6px;

    @media (max-width: 768px) {
        gap: 4px;
    }

    @media (max-width: 480px) {
        gap: 3px;
        flex-direction: column;
    }

    @media (max-width: 360px) {
        gap: 2px;
    }
`

const StyledColorItem = styled.div<{ $color: Color }>`
    display: flex;
    align-items: center;
    gap: 6px;
    flex: 1;
    padding: 4px 6px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 6px;

    @media (max-width: 768px) {
        gap: 4px;
        padding: 3px 5px;
    }

    @media (max-width: 480px) {
        gap: 3px;
        padding: 2px 4px;
        flex-direction: column;
        text-align: center;
    }

    @media (max-width: 360px) {
        gap: 2px;
    }
`

const StyledColorBlock = styled.div<{ $color: Color }>`
    width: 16px;
    height: 16px;
    border-radius: 3px;
    background-color: ${({ $color }) => {
        const colorMap = {
            red: '#e74c3c',
            blue: '#3498db',
            green: '#27ae60',
            purple: '#9b59b6',
        }
        return colorMap[$color]
    }};
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    flex-shrink: 0;

    @media (max-width: 768px) {
        width: 14px;
        height: 14px;
    }

    @media (max-width: 480px) {
        width: 12px;
        height: 12px;
        border-radius: 2px;
    }
`

const StyledBlockInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1px;
    flex: 1;
    min-width: 0;

    @media (max-width: 480px) {
        align-items: center;
    }
`

const StyledScore = styled.div`
    color: #fff;
    font-size: 11px;
    font-weight: bold;
    line-height: 1.2;

    @media (max-width: 768px) {
        font-size: 10px;
    }

    @media (max-width: 480px) {
        font-size: 9px;
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
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    opacity: 1;
    line-height: 1.2;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);

    @media (max-width: 768px) {
        font-size: 9px;
        letter-spacing: 0.2px;
    }

    @media (max-width: 480px) {
        font-size: 8px;
        letter-spacing: 0.1px;
    }
`

const StyledBlocksAndActionsSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`

const StyledActionsContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 12px;

    @media (max-width: 480px) {
        gap: 8px;
    }
`

const StyledResetButton = styled.button`
    background: linear-gradient(135deg, #e74c3c, #c0392b);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 8px 16px;
    font-size: 0.8rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(231, 76, 60, 0.3);

    &:hover {
        background: linear-gradient(135deg, #c0392b, #a93226);
        transform: translateY(-1px);
        box-shadow: 0 3px 6px rgba(231, 76, 60, 0.4);
    }

    &:active {
        transform: translateY(0);
        box-shadow: 0 1px 2px rgba(231, 76, 60, 0.3);
    }

    @media (max-width: 768px) {
        font-size: 0.7rem;
        padding: 6px 12px;
    }

    @media (max-width: 480px) {
        font-size: 0.6rem;
        padding: 6px 10px;
    }
`

type PvPScoreGuideProps = {
    players: [PlayerInfo, PlayerInfo]
    currentPlayer: 1 | 2
    turnTimeLeft: number
    onReset: () => void
    lastDamage?: { [playerId: number]: PlayerDamageInfo }
}

export const PvPScoreGuide: React.FC<PvPScoreGuideProps> = ({
    players,
    currentPlayer,
    turnTimeLeft,
    onReset,
    lastDamage,
}) => {
    const { settings } = useAppContext()
    const [, forceUpdate] = useState({})
    const colorOrder: Color[] = ['blue', 'red', 'green', 'purple']

    // Принудительно обновляем компонент для скрытия индикаторов урона
    useEffect(() => {
        if (!lastDamage) return

        const timeouts = Object.values(lastDamage)
            .map((damage) => {
                const timeRemaining =
                    3000 - (Date.now() - damage.timestamp)
                if (timeRemaining > 0) {
                    return setTimeout(() => {
                        forceUpdate({})
                    }, timeRemaining)
                }
                return null
            })
            .filter(Boolean)

        return () => {
            timeouts.forEach((timeout) => {
                if (timeout) clearTimeout(timeout)
            })
        }
    }, [lastDamage])
    const rarityLabels = {
        blue: 'Частый',
        red: 'Средний',
        green: 'Редкий',
        purple: 'Очень редкий',
    }

    const t = (key: Parameters<typeof getTranslation>[1]) =>
        getTranslation(settings.language, key)

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const isTimeWarning = turnTimeLeft <= 10

    return (
        <StyledGuide>
            <StyledContainer>
                {/* Секция таймера */}
                <StyledTimerSection>
                    <StyledTimerText>Время хода:</StyledTimerText>
                    <StyledTimerValue $isWarning={isTimeWarning}>
                        {formatTime(turnTimeLeft)}
                    </StyledTimerValue>
                </StyledTimerSection>

                {/* Секция игроков */}
                <StyledPlayersSection>
                    {players.map((player) => {
                        const isActive = player.id === currentPlayer
                        const hpPercentage =
                            (player.hp / player.maxHp) * 100

                        // Проверяем есть ли урон для показа
                        const playerDamage = lastDamage?.[player.id]
                        const shouldShowDamage =
                            playerDamage &&
                            Date.now() - playerDamage.timestamp < 3000 // показываем 3 секунды

                        return (
                            <StyledPlayerCard
                                key={player.id}
                                $isActive={isActive}
                            >
                                <StyledPlayerIcon>
                                    {player.icon}
                                    {shouldShowDamage && (
                                        <StyledDamageIndicator>
                                            -{playerDamage.damage}
                                        </StyledDamageIndicator>
                                    )}
                                </StyledPlayerIcon>
                                <StyledPlayerInfo>
                                    <StyledPlayerName>
                                        {player.id === 1
                                            ? t('player1')
                                            : t('player2')}
                                        {isActive && (
                                            <StyledTurnIndicator>
                                                {t('yourTurn')}
                                            </StyledTurnIndicator>
                                        )}
                                    </StyledPlayerName>
                                    <StyledHpContainer>
                                        <StyledHpBar>
                                            <StyledHpFill
                                                $percentage={
                                                    hpPercentage
                                                }
                                            />
                                        </StyledHpBar>
                                        <StyledHpText>
                                            {player.hp}/{player.maxHp}
                                        </StyledHpText>
                                    </StyledHpContainer>
                                </StyledPlayerInfo>
                            </StyledPlayerCard>
                        )
                    })}
                </StyledPlayersSection>

                <StyledDivider />

                {/* Секция стоимости блоков и действий */}
                <StyledBlocksAndActionsSection>
                    <div>
                        <StyledTitle>Стоимость блоков</StyledTitle>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <StyledColorList>
                                {colorOrder.map((color) => (
                                    <StyledColorItem
                                        key={color}
                                        $color={color}
                                    >
                                        <StyledColorBlock
                                            $color={color}
                                        />
                                        <StyledBlockInfo>
                                            <StyledScore>
                                                {
                                                    SCORE_MULTIPLIERS[
                                                        color
                                                    ]
                                                }{' '}
                                                урон
                                            </StyledScore>
                                            <StyledRarity
                                                $color={color}
                                            >
                                                {rarityLabels[color]}
                                            </StyledRarity>
                                        </StyledBlockInfo>
                                    </StyledColorItem>
                                ))}
                            </StyledColorList>
                            <StyledActionsContainer>
                                <StyledResetButton onClick={onReset}>
                                    🔄 Новая игра
                                </StyledResetButton>
                            </StyledActionsContainer>
                        </div>
                    </div>
                </StyledBlocksAndActionsSection>
            </StyledContainer>
        </StyledGuide>
    )
}
