import styled from 'styled-components'

import React from 'react'
import { useNavigate } from 'react-router-dom'

import { useAppContext } from '@app/contexts/AppContext'
import type { Language } from '@shared/types/game'
import { getTranslation } from '@shared/utils/translations'

const StyledSettingsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 2rem;
    background: linear-gradient(135deg, #4c63d2 0%, #7c3aed 100%);
    color: white;
    width: 100%;

    // /* Адаптивный контейнер настроек */
    // @media (max-width: 768px) {
    //     padding: 1.5rem;
    //     justify-content: flex-start;
    //     padding-top: 2rem;
    // }

    // // @media (max-width: 480px) {
    // //     padding: 1rem;
    // //     padding-top: 1.5rem;
    // // }

    // // @media (max-width: 360px) {
    // //     padding: 0.75rem;
    // //     padding-top: 1rem;
    // // }
`

const StyledHeader = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 500px;
    margin-bottom: 3rem;
    position: relative;

    /* Адаптивный заголовок */
    @media (max-width: 768px) {
        margin-bottom: 2.5rem;
        max-width: 100%;
    }

    @media (max-width: 480px) {
        margin-bottom: 2rem;
        flex-direction: column;
        gap: 1rem;
        position: static;
    }

    @media (max-width: 360px) {
        margin-bottom: 1.5rem;
        gap: 0.75rem;
    }
`

const StyledBackButton = styled.button`
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 10px;
    padding: 0.75rem 1rem;
    color: white;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    min-height: 44px;

    /* Адаптивная кнопка назад */
    @media (max-width: 768px) {
        padding: 0.8rem 1.2rem;
        font-size: 1rem;
        min-height: 48px;
    }

    @media (max-width: 480px) {
        padding: 0.75rem 1rem;
        font-size: 0.9rem;
        min-height: 44px;
        width: 100%;
        position: static;
        transform: none !important;
    }

    @media (max-width: 360px) {
        padding: 0.6rem 0.8rem;
        font-size: 0.85rem;
        min-height: 40px;
    }

    &:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: translateY(-2px);
    }

    /* Убираем hover эффекты на мобильных */
    @media (hover: none) and (pointer: coarse) {
        &:hover {
            transform: none;
            background: rgba(255, 255, 255, 0.25);
        }
    }
`

const StyledTitle = styled.h1`
    font-size: 2.5rem;
    font-weight: bold;
    margin: 0;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);

    /* Адаптивный заголовок */
    @media (max-width: 768px) {
        font-size: 2.2rem;
    }

    @media (max-width: 480px) {
        font-size: 2rem;
        position: static;
        transform: none;
        text-align: center;
        width: 100%;
    }

    @media (max-width: 360px) {
        font-size: 1.75rem;
    }
`

const StyledSettingsContent = styled.div`
    width: 100%;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    gap: 2rem;

    /* Адаптивный контент */
    @media (max-width: 768px) {
        max-width: 100%;
        gap: 1.5rem;
    }

    @media (max-width: 480px) {
        gap: 1.25rem;
    }

    @media (max-width: 360px) {
        gap: 1rem;
    }
`

const StyledSettingGroup = styled.div`
    background: rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    padding: 2rem;
    backdrop-filter: blur(10px);

    /* Адаптивная группа настроек */
    @media (max-width: 768px) {
        padding: 1.75rem;
        border-radius: 12px;
    }

    @media (max-width: 480px) {
        padding: 1.5rem;
        border-radius: 10px;
    }

    @media (max-width: 360px) {
        padding: 1.25rem;
        border-radius: 8px;
    }
`

const StyledSettingLabel = styled.h3`
    font-size: 1.3rem;
    margin: 0 0 1rem 0;
    font-weight: 600;

    /* Адаптивная метка настройки */
    @media (max-width: 768px) {
        font-size: 1.2rem;
        margin: 0 0 0.875rem 0;
    }

    @media (max-width: 480px) {
        font-size: 1.1rem;
        margin: 0 0 0.75rem 0;
    }

    @media (max-width: 360px) {
        font-size: 1rem;
        margin: 0 0 0.625rem 0;
    }
`

const StyledLanguageButtons = styled.div`
    display: flex;
    gap: 1rem;

    /* Адаптивные кнопки языка */
    @media (max-width: 768px) {
        gap: 0.75rem;
    }

    @media (max-width: 480px) {
        flex-direction: column;
        gap: 0.75rem;
    }

    @media (max-width: 360px) {
        gap: 0.5rem;
    }
`

const StyledLanguageButton = styled.button<{ $active?: boolean }>`
    flex: 1;
    padding: 1rem;
    font-size: 1rem;
    font-weight: 600;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
    min-height: 44px;

    /* Адаптивные кнопки языка */
    @media (max-width: 768px) {
        padding: 1.1rem;
        font-size: 1rem;
        min-height: 48px;
    }

    @media (max-width: 480px) {
        padding: 1rem;
        font-size: 0.95rem;
        min-height: 44px;
        width: 100%;
    }

    @media (max-width: 360px) {
        padding: 0.875rem;
        font-size: 0.9rem;
        min-height: 40px;
    }

    ${({ $active }) =>
        $active
            ? `
        background: #ff6b6b;
        color: white;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    `
            : `
        background: rgba(255, 255, 255, 0.2);
        color: white;
        
        &:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
        }
    `}

    /* Убираем hover эффекты на мобильных */
    @media (hover: none) and (pointer: coarse) {
        &:hover {
            transform: none;
            background: ${({ $active }) =>
                $active ? '#ff6b6b' : 'rgba(255, 255, 255, 0.25)'};
        }
    }
`

const StyledSoundToggle = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;

    /* Адаптивный переключатель звука */
    @media (max-width: 480px) {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
    }

    @media (max-width: 360px) {
        gap: 0.75rem;
    }
`

const StyledSoundStatus = styled.span`
    font-size: 1.1rem;
    font-weight: 500;

    /* Адаптивный статус звука */
    @media (max-width: 768px) {
        font-size: 1.05rem;
    }

    @media (max-width: 480px) {
        font-size: 1rem;
        text-align: center;
    }

    @media (max-width: 360px) {
        font-size: 0.95rem;
    }
`

const StyledToggleButton = styled.button<{ $enabled?: boolean }>`
    background: ${({ $enabled }) =>
        $enabled ? '#22c55e' : '#ef4444'};
    border: none;
    border-radius: 25px;
    padding: 0.75rem 1.5rem;
    color: white;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 80px;
    min-height: 44px;

    /* Адаптивная кнопка переключения */
    @media (max-width: 768px) {
        padding: 0.8rem 1.6rem;
        font-size: 1rem;
        min-height: 48px;
        min-width: 90px;
    }

    @media (max-width: 480px) {
        padding: 0.75rem 1.5rem;
        font-size: 0.95rem;
        min-height: 44px;
        width: 100%;
        min-width: auto;
    }

    @media (max-width: 360px) {
        padding: 0.6rem 1.2rem;
        font-size: 0.9rem;
        min-height: 40px;
    }

    &:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    /* Убираем hover эффекты на мобильных */
    @media (hover: none) and (pointer: coarse) {
        &:hover {
            transform: none;
            box-shadow: none;
        }
    }
`

export const SettingsScreen: React.FC = () => {
    const navigate = useNavigate()
    const { settings, updateLanguage, toggleSound } = useAppContext()

    const t = (key: Parameters<typeof getTranslation>[1]) =>
        getTranslation(settings.language, key)

    const handleLanguageChange = (language: Language) => {
        updateLanguage(language)
    }

    return (
        <StyledSettingsContainer>
            <StyledHeader>
                <StyledBackButton onClick={() => navigate('/')}>
                    ← {t('back')}
                </StyledBackButton>
                <StyledTitle>{t('settingsTitle')}</StyledTitle>
            </StyledHeader>

            <StyledSettingsContent>
                <StyledSettingGroup>
                    <StyledSettingLabel>
                        {t('language')}
                    </StyledSettingLabel>
                    <StyledLanguageButtons>
                        <StyledLanguageButton
                            $active={settings.language === 'ru'}
                            onClick={() => handleLanguageChange('ru')}
                        >
                            {t('languageRu')}
                        </StyledLanguageButton>
                        <StyledLanguageButton
                            $active={settings.language === 'en'}
                            onClick={() => handleLanguageChange('en')}
                        >
                            {t('languageEn')}
                        </StyledLanguageButton>
                    </StyledLanguageButtons>
                </StyledSettingGroup>

                <StyledSettingGroup>
                    <StyledSettingLabel>
                        {t('sound')}
                    </StyledSettingLabel>
                    <StyledSoundToggle>
                        <StyledSoundStatus>
                            {settings.soundEnabled
                                ? t('soundOn')
                                : t('soundOff')}
                        </StyledSoundStatus>
                        <StyledToggleButton
                            $enabled={settings.soundEnabled}
                            onClick={toggleSound}
                        >
                            {settings.soundEnabled
                                ? t('soundOn')
                                : t('soundOff')}
                        </StyledToggleButton>
                    </StyledSoundToggle>
                </StyledSettingGroup>
            </StyledSettingsContent>
        </StyledSettingsContainer>
    )
}
