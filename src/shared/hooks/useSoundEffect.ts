import { useCallback, useRef } from 'react'

type SoundType = 'explosion' | 'selection' | 'confirm'

export const useSoundEffect = () => {
    const audioContextRef = useRef<AudioContext | null>(null)

    // Инициализация AudioContext (ленивая)
    const getAudioContext = useCallback(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext ||
                (window as any).webkitAudioContext)()
        }
        return audioContextRef.current
    }, [])

    // Создание звука взрыва
    const createExplosionSound = useCallback(
        (context: AudioContext) => {
            const duration = 0.5
            const sampleRate = context.sampleRate
            const samples = sampleRate * duration
            const buffer = context.createBuffer(
                1,
                samples,
                sampleRate
            )
            const channelData = buffer.getChannelData(0)

            // Генерируем шум взрыва
            for (let i = 0; i < samples; i++) {
                const t = i / sampleRate
                const envelope = Math.exp(-t * 8) // экспоненциальное затухание
                const noise = (Math.random() * 2 - 1) * envelope
                const lowFreq =
                    Math.sin(2 * Math.PI * 60 * t) * envelope * 0.3
                const midFreq =
                    Math.sin(2 * Math.PI * 120 * t) * envelope * 0.2

                channelData[i] = (noise + lowFreq + midFreq) * 0.5
            }

            return buffer
        },
        []
    )

    // Создание звука выделения
    const createSelectionSound = useCallback(
        (context: AudioContext) => {
            const duration = 0.1
            const sampleRate = context.sampleRate
            const samples = sampleRate * duration
            const buffer = context.createBuffer(
                1,
                samples,
                sampleRate
            )
            const channelData = buffer.getChannelData(0)

            for (let i = 0; i < samples; i++) {
                const t = i / sampleRate
                const envelope = Math.exp(-t * 20)
                const frequency = 800 + t * 400 // поднимающаяся нота
                channelData[i] =
                    Math.sin(2 * Math.PI * frequency * t) *
                    envelope *
                    0.3
            }

            return buffer
        },
        []
    )

    // Создание звука подтверждения
    const createConfirmSound = useCallback(
        (context: AudioContext) => {
            const duration = 0.2
            const sampleRate = context.sampleRate
            const samples = sampleRate * duration
            const buffer = context.createBuffer(
                1,
                samples,
                sampleRate
            )
            const channelData = buffer.getChannelData(0)

            for (let i = 0; i < samples; i++) {
                const t = i / sampleRate
                const envelope = Math.exp(-t * 10)
                const frequency = 600 - t * 200 // падающая нота
                channelData[i] =
                    Math.sin(2 * Math.PI * frequency * t) *
                    envelope *
                    0.4
            }

            return buffer
        },
        []
    )

    // Воспроизведение звука
    const playSound = useCallback(
        (soundType: SoundType, volume: number = 0.5) => {
            try {
                const context = getAudioContext()

                if (context.state === 'suspended') {
                    context.resume()
                }

                let buffer: AudioBuffer

                switch (soundType) {
                    case 'explosion':
                        buffer = createExplosionSound(context)
                        break
                    case 'selection':
                        buffer = createSelectionSound(context)
                        break
                    case 'confirm':
                        buffer = createConfirmSound(context)
                        break
                    default:
                        return
                }

                const source = context.createBufferSource()
                const gainNode = context.createGain()

                source.buffer = buffer
                gainNode.gain.value = Math.max(0, Math.min(1, volume))

                source.connect(gainNode)
                gainNode.connect(context.destination)

                source.start(0)
            } catch (error) {
                console.warn('Ошибка воспроизведения звука:', error)
            }
        },
        [
            getAudioContext,
            createExplosionSound,
            createSelectionSound,
            createConfirmSound,
        ]
    )

    return { playSound }
}
