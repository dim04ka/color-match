import React, { createContext, useContext } from 'react'

import { useAppSettings } from '@shared/hooks/useAppSettings'

type AppContextValue = {
    settings: ReturnType<typeof useAppSettings>['settings']
    updateLanguage: ReturnType<
        typeof useAppSettings
    >['updateLanguage']
    toggleSound: ReturnType<typeof useAppSettings>['toggleSound']
    resetSettings: ReturnType<typeof useAppSettings>['resetSettings']
}

const AppContext = createContext<AppContextValue | undefined>(
    undefined
)

export const useAppContext = () => {
    const context = useContext(AppContext)
    if (context === undefined) {
        throw new Error(
            'useAppContext must be used within an AppProvider'
        )
    }
    return context
}

type AppProviderProps = {
    children: React.ReactNode
}

export const AppProvider: React.FC<AppProviderProps> = ({
    children,
}) => {
    const { settings, updateLanguage, toggleSound, resetSettings } =
        useAppSettings()

    const value = {
        settings,
        updateLanguage,
        toggleSound,
        resetSettings,
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}
