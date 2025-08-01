import styled from 'styled-components'

import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { useAppContext } from '@app/contexts/AppContext'
import type { GameMode } from '@shared/types/game'
import { getTranslation } from '@shared/utils/translations'

import { ColorMatchGame } from './ColorMatchGame'
import { PvPColorMatchGame } from './PvPColorMatchGame'

const StyledGameContainer = styled.div`
    position: relative;
    min-height: 100vh;
`

const StyledMenuButton = styled.button`
    position: absolute;
    top: 1rem;
    left: 1rem;
    background: rgba(0, 0, 0, 0.7);
    border: none;
    border-radius: 10px;
    padding: 0.75rem 1rem;
    color: white;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    z-index: 100;
    min-height: 44px;

    /* Адаптивная кнопка меню */
    @media (max-width: 768px) {
        font-size: 0.85rem;
        padding: 0.6rem 0.9rem;
        min-height: 48px;
    }

    @media (max-width: 480px) {
        font-size: 0.8rem;
        padding: 0.5rem 0.75rem;
        min-height: 44px;
        top: 0.75rem;
        left: 0.75rem;
    }

    @media (max-width: 360px) {
        font-size: 0.75rem;
        padding: 0.4rem 0.6rem;
        min-height: 40px;
        top: 0.5rem;
        left: 0.5rem;
    }

    &:hover {
        background: rgba(0, 0, 0, 0.9);
        transform: translateY(-2px);
    }

    /* Убираем hover эффекты на мобильных */
    @media (hover: none) and (pointer: coarse) {
        &:hover {
            transform: none;
            background: rgba(0, 0, 0, 0.8);
        }
    }
`

export const GameScreen: React.FC = () => {
    const navigate = useNavigate()
    const { settings } = useAppContext()
    const [searchParams] = useSearchParams()

    const t = (key: Parameters<typeof getTranslation>[1]) =>
        getTranslation(settings.language, key)

    const gameMode: GameMode = (searchParams.get('mode') as GameMode) || 'singleplayer'

    return (
        <StyledGameContainer>
            <StyledMenuButton onClick={() => navigate('/')}>
                ← {t('backToMenu')}
            </StyledMenuButton>
            {gameMode === 'pvp' ? <PvPColorMatchGame /> : <ColorMatchGame />}
        </StyledGameContainer>
    )
}
