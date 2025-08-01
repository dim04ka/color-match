import styled from 'styled-components'

import React from 'react'

import { useAppContext } from '@app/contexts/AppContext'
import type { PlayerInfo as PlayerInfoType } from '@shared/types/game'
import { getTranslation } from '@shared/utils/translations'

type StyledPlayerContainerProps = {
    $isActive: boolean
    $position: 'left' | 'right'
}

const StyledPlayerContainer = styled.div<StyledPlayerContainerProps>`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    ${({ $position }) => $position}: 1rem;
    
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    background: ${({ $isActive }) => 
        $isActive 
            ? 'rgba(255, 215, 0, 0.9)' 
            : 'rgba(0, 0, 0, 0.7)'
    };
    border-radius: 15px;
    border: ${({ $isActive }) => 
        $isActive 
            ? '3px solid #ffd700' 
            : '2px solid rgba(255, 255, 255, 0.3)'
    };
    color: white;
    min-width: 120px;
    z-index: 10;
    transition: all 0.3s ease;
    
    ${({ $isActive }) => $isActive && `
        box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
        animation: pulse 2s infinite;
    `}

    @keyframes pulse {
        0% { transform: translateY(-50%) scale(1); }
        50% { transform: translateY(-50%) scale(1.05); }
        100% { transform: translateY(-50%) scale(1); }
    }

    @media (max-width: 768px) {
        min-width: 100px;
        padding: 0.75rem;
        ${({ $position }) => $position}: 0.75rem;
        font-size: 0.9rem;
    }

    @media (max-width: 480px) {
        min-width: 80px;
        padding: 0.5rem;
        ${({ $position }) => $position}: 0.5rem;
        font-size: 0.8rem;
    }
`

const StyledPlayerIcon = styled.div`
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));

    @media (max-width: 768px) {
        font-size: 2rem;
        margin-bottom: 0.4rem;
    }

    @media (max-width: 480px) {
        font-size: 1.5rem;
        margin-bottom: 0.3rem;
    }
`

const StyledPlayerName = styled.div`
    font-weight: bold;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
    text-align: center;

    @media (max-width: 768px) {
        font-size: 0.8rem;
        margin-bottom: 0.4rem;
    }

    @media (max-width: 480px) {
        font-size: 0.7rem;
        margin-bottom: 0.3rem;
    }
`

const StyledHpContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
`

const StyledHpBar = styled.div`
    width: 100%;
    height: 8px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 0.25rem;

    @media (max-width: 480px) {
        height: 6px;
    }
`

type StyledHpFillProps = {
    $percentage: number
}

const StyledHpFill = styled.div<StyledHpFillProps>`
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
    font-size: 0.8rem;
    font-weight: bold;
    text-align: center;

    @media (max-width: 768px) {
        font-size: 0.7rem;
    }

    @media (max-width: 480px) {
        font-size: 0.6rem;
    }
`

const StyledTurnIndicator = styled.div`
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    background: #ffd700;
    color: #333;
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.7rem;
    font-weight: bold;
    white-space: nowrap;

    @media (max-width: 480px) {
        font-size: 0.6rem;
        padding: 0.2rem 0.4rem;
    }
`

type PlayerInfoProps = {
    player: PlayerInfoType
    isActive: boolean
    position: 'left' | 'right'
}

export const PlayerInfo: React.FC<PlayerInfoProps> = ({
    player,
    isActive,
    position,
}) => {
    const { settings } = useAppContext()
    const hpPercentage = (player.hp / player.maxHp) * 100

    const t = (key: Parameters<typeof getTranslation>[1]) =>
        getTranslation(settings.language, key)

    return (
        <StyledPlayerContainer $isActive={isActive} $position={position}>
            {isActive && (
                <StyledTurnIndicator>
                    {t('yourTurn')}
                </StyledTurnIndicator>
            )}
            
            <StyledPlayerIcon>{player.icon}</StyledPlayerIcon>
            <StyledPlayerName>
                {player.id === 1 ? t('player1') : t('player2')}
            </StyledPlayerName>
            
            <StyledHpContainer>
                <StyledHpBar>
                    <StyledHpFill $percentage={hpPercentage} />
                </StyledHpBar>
                <StyledHpText>
                    {player.hp} / {player.maxHp} {t('hp')}
                </StyledHpText>
            </StyledHpContainer>
        </StyledPlayerContainer>
    )
}