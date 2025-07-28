import styled from 'styled-components'

import React from 'react'
import { useNavigate } from 'react-router-dom'

import { useAppContext } from '@app/contexts/AppContext'
import { getTranslation } from '@shared/utils/translations'

const StyledWelcomeContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    text-align: center;
`

const StyledTitle = styled.h1`
    font-size: 3.5rem;
    font-weight: bold;
    margin: 0 0 0.5rem 0;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);

    @media (max-width: 768px) {
        font-size: 2.5rem;
    }
`

const StyledSubtitle = styled.h2`
    font-size: 1.5rem;
    font-weight: 300;
    margin: 0 0 2rem 0;
    opacity: 0.9;

    @media (max-width: 768px) {
        font-size: 1.2rem;
    }
`

const StyledDescription = styled.p`
    font-size: 1.1rem;
    line-height: 1.6;
    max-width: 600px;
    margin: 0 0 3rem 0;
    opacity: 0.9;

    @media (max-width: 768px) {
        font-size: 1rem;
        margin: 0 0 2rem 0;
    }
`

const StyledButtonContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    max-width: 300px;
`

const StyledButton = styled.button<{ $primary?: boolean }>`
    padding: 1rem 2rem;
    font-size: 1.1rem;
    font-weight: 600;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;

    ${({ $primary }) =>
        $primary
            ? `
        background: #ff6b6b;
        color: white;
        
        &:hover {
            background: #ff5252;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
    `
            : `
        background: rgba(255, 255, 255, 0.2);
        color: white;
        border: 2px solid rgba(255, 255, 255, 0.3);
        
        &:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
        }
    `}

    &:active {
        transform: translateY(0);
    }
`

const StyledSettingsButton = styled.button`
    position: absolute;
    top: 2rem;
    right: 2rem;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 50%;
    width: 3rem;
    height: 3rem;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: scale(1.1);
    }

    @media (max-width: 768px) {
        top: 1rem;
        right: 1rem;
        width: 2.5rem;
        height: 2.5rem;
        font-size: 1rem;
    }
`

const StyledInstructions = styled.div`
    background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
    color: white;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 20px;
    font-size: 14px;
    line-height: 1.5;

    /* Адаптивные инструкции */
    @media (max-width: 768px) {
        padding: 14px;
        font-size: 14px;
        margin-bottom: 16px;
        border-radius: 6px;
    }

    @media (max-width: 480px) {
        padding: 12px;
        font-size: 13px;
        margin-bottom: 12px;
        line-height: 1.4;
    }

    @media (max-width: 360px) {
        padding: 10px;
        font-size: 12px;
        margin-bottom: 10px;
    }
`

export const WelcomeScreen: React.FC = () => {
    const navigate = useNavigate()
    const { settings } = useAppContext()

    const t = (key: Parameters<typeof getTranslation>[1]) =>
        getTranslation(settings.language, key)

    return (
        <StyledWelcomeContainer>
            <StyledSettingsButton
                onClick={() => navigate('/settings')}
                title={t('settings')}
            >
                ⚙️
            </StyledSettingsButton>

            <StyledTitle>{t('welcomeTitle')}</StyledTitle>
            <StyledSubtitle>{t('welcomeSubtitle')}</StyledSubtitle>
            <StyledDescription>
                {t('gameDescription')}
            </StyledDescription>

            <StyledInstructions>
                <strong>Как играть:</strong> Зажмите и тяните мышь
                (или палец на мобильном) по соседним блокам одного
                цвета, чтобы создать цепочку. Отпустите для завершения
                выделения. Минимум 2 блока для засчёта.
                <br />
                <br />
                <strong>💣 Бомбы:</strong> Взрывают все соседние блоки
                (8 направлений).
                <br />
                <strong>⬅️➡️ Горизонтальные полосы:</strong>{' '}
                Уничтожают всю строку.
                <br />
                <strong>⬆️⬇️ Вертикальные полосы:</strong> Уничтожают
                весь столбец.
                <br />
                Все уничтоженные блоки засчитываются к очкам!
            </StyledInstructions>

            <StyledButtonContainer>
                <StyledButton
                    $primary
                    onClick={() => navigate('/game')}
                >
                    {t('startGame')}
                </StyledButton>

                <StyledButton onClick={() => navigate('/settings')}>
                    {t('settings')}
                </StyledButton>
            </StyledButtonContainer>
        </StyledWelcomeContainer>
    )
}
