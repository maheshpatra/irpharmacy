/**
 * CustomAlert — global animated alert modal.
 *
 * Usage (from any component or store):
 *   import { showAlert } from '@/components/CustomAlert';
 *   showAlert({ type: 'error', title: 'Cannot Add', message: 'Out of stock.' });
 *   showAlert({ type: 'success', title: 'Done', message: 'Added to cart!',
 *               buttons: [{ text: 'View Cart', onPress: () => router.push('/cart') }] });
 *
 * Mount <GlobalAlertModal /> once in your root _layout.tsx.
 */

import React, { useEffect, useRef } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { create } from 'zustand';

const { width } = Dimensions.get('window');

// ── Types ────────────────────────────────────────────────────────────────────

export type AlertType = 'success' | 'error' | 'warning' | 'info' | 'confirm';

export interface AlertButton {
    text: string;
    style?: 'default' | 'cancel' | 'destructive';
    onPress?: () => void;
}

export interface AlertConfig {
    type?: AlertType;
    title: string;
    message?: string;
    buttons?: AlertButton[];
}

// ── Global Zustand store (tiny, no persistence) ───────────────────────────────

interface AlertState {
    visible: boolean;
    config: AlertConfig | null;
    _show: (cfg: AlertConfig) => void;
    _hide: () => void;
}

const useAlertStore = create<AlertState>((set) => ({
    visible: false,
    config: null,
    _show: (cfg) => set({ visible: true, config: cfg }),
    _hide: () => set({ visible: false }),
}));

// ── Public API — call from anywhere ──────────────────────────────────────────

export function showAlert(cfg: AlertConfig): void {
    useAlertStore.getState()._show(cfg);
}

export function hideAlert(): void {
    useAlertStore.getState()._hide();
}

// ── Theme map ────────────────────────────────────────────────────────────────

const THEMES: Record<AlertType, {
    icon: any; colors: [string, string]; iconColor: string; bg: string;
}> = {
    success: { icon: 'checkmark-circle', colors: ['#43A047', '#66BB6A'], iconColor: '#fff', bg: '#F1FFF4' },
    error: { icon: 'close-circle', colors: ['#E53935', '#EF5350'], iconColor: '#fff', bg: '#FFF5F5' },
    warning: { icon: 'warning', colors: ['#FB8C00', '#FFA726'], iconColor: '#fff', bg: '#FFFBF0' },
    info: { icon: 'information-circle', colors: ['#1E88E5', '#42A5F5'], iconColor: '#fff', bg: '#F0F7FF' },
    confirm: { icon: 'help-circle', colors: ['#5E35B1', '#7E57C2'], iconColor: '#fff', bg: '#F5F0FF' },
};

// ── Modal component ───────────────────────────────────────────────────────────

export function GlobalAlertModal() {
    const { visible, config, _hide } = useAlertStore();

    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 120, friction: 8 }),
                Animated.timing(opacityAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(scaleAnim, { toValue: 0.85, duration: 150, useNativeDriver: true }),
                Animated.timing(opacityAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
            ]).start();
        }
    }, [visible]);

    if (!config) return null;

    const type = config.type ?? 'info';
    const theme = THEMES[type];
    const buttons: AlertButton[] = config.buttons?.length
        ? config.buttons
        : [{ text: 'OK', style: 'default' }];

    const handlePress = (btn: AlertButton) => {
        _hide();
        setTimeout(() => btn.onPress?.(), 200); // after close animation
    };

    return (
        <Modal transparent visible={visible} animationType="none" statusBarTranslucent>
            {/* Overlay */}
            <Animated.View style={[styles.overlay, { opacity: opacityAnim }]}>
                <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={() => {
                    // Close on backdrop tap only if no buttons or single OK
                    if (buttons.length <= 1) _hide();
                }} />

                {/* Card */}
                <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }], opacity: opacityAnim }]}>
                    {/* Header gradient */}
                    <LinearGradient
                        colors={theme.colors}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.header}
                    >
                        <View style={styles.iconCircle}>
                            <Ionicons name={theme.icon} size={38} color={theme.iconColor} />
                        </View>
                    </LinearGradient>

                    {/* Body */}
                    <View style={[styles.body, { backgroundColor: theme.bg }]}>
                        <Text style={styles.title}>{config.title}</Text>
                        {!!config.message && (
                            <Text style={styles.message}>{config.message}</Text>
                        )}
                    </View>

                    {/* Buttons */}
                    <View style={styles.btnRow}>
                        {buttons.map((btn, i) => {
                            const isDestructive = btn.style === 'destructive';
                            const isCancel = btn.style === 'cancel';
                            const isLast = i === buttons.length - 1;

                            return (
                                <TouchableOpacity
                                    key={i}
                                    onPress={() => handlePress(btn)}
                                    activeOpacity={0.78}
                                    style={[
                                        styles.btnBase,
                                        i > 0 && { borderLeftWidth: 1, borderLeftColor: '#EDEDED' },
                                    ]}
                                >
                                    {isDestructive || (!isCancel && isLast) ? (
                                        <LinearGradient
                                            colors={isDestructive ? ['#E53935', '#EF5350'] : theme.colors}
                                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                            style={styles.btnGradient}
                                        >
                                            <Text style={styles.btnTextPrimary}>{btn.text}</Text>
                                        </LinearGradient>
                                    ) : (
                                        <View style={styles.btnPlain}>
                                            <Text style={[styles.btnTextSecondary, isDestructive && { color: '#E53935' }]}>
                                                {btn.text}
                                            </Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const CARD_WIDTH = Math.min(width * 0.84, 340);

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(10,10,20,0.60)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: CARD_WIDTH,
        borderRadius: 26,
        overflow: 'hidden',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.28,
        shadowRadius: 24,
        elevation: 24,
    },
    header: {
        height: 105,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 0,
    },
    iconCircle: {
        width: 76,
        height: 76,
        borderRadius: 38,
        backgroundColor: 'rgba(255,255,255,0.28)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: -38,
        borderWidth: 4,
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.18,
        shadowRadius: 10,
        elevation: 10,
        zIndex: 10,
    },
    body: {
        paddingTop: 52,
        paddingHorizontal: 26,
        paddingBottom: 22,
        alignItems: 'center',
    },
    title: {
        fontFamily: 'novabold',
        fontSize: 19,
        color: '#1A1A2E',
        textAlign: 'center',
        marginBottom: 8,
        letterSpacing: 0.2,
    },
    message: {
        fontFamily: 'novaregular',
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
    },
    btnRow: {
        flexDirection: 'row',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#E0E0E0',
        backgroundColor: '#FAFAFA',
    },
    btnBase: {
        flex: 1,
        minHeight: 54,
        overflow: 'hidden',
    },
    btnGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
    },
    btnPlain: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
    },
    btnTextPrimary: {
        fontFamily: 'novabold',
        fontSize: 15,
        color: '#fff',
        letterSpacing: 0.3,
    },
    btnTextSecondary: {
        fontFamily: 'novabold',
        fontSize: 15,
        color: '#999',
        letterSpacing: 0.3,
    },
});
