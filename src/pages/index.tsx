import React from 'react'
import {
    Navigate,
    Route,
    BrowserRouter as Router,
    Routes,
} from 'react-router-dom'

import {
    GameScreen,
    SettingsScreen,
    WelcomeScreen,
} from '@app/components'
import { AppProvider } from '@app/contexts/AppContext'

export const RootPage: React.FC = () => {
    return (
        <AppProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<WelcomeScreen />} />
                    <Route path="/game" element={<GameScreen />} />
                    <Route
                        path="/settings"
                        element={<SettingsScreen />}
                    />
                    {/* Редирект на главную для несуществующих роутов */}
                    <Route
                        path="*"
                        element={<Navigate to="/" replace />}
                    />
                </Routes>
            </Router>
        </AppProvider>
    )
}
