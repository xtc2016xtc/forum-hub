import type { Config } from 'tailwindcss'
import tailwindcssAnimate from 'tailwindcss-animate'

// 动画配置模块
const animationConfig = {
    extend: {
        animation: {
            'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            'bounce-in-up': 'bounce-in-up 0.7s ease-out',
            'tab-animate': 'tab-animate 0.5s ease-out',
        },
        keyframes: {
            'bounce-in-up': {
                '0%': { transform: 'translateY(20px) rotateX(10deg)', opacity: '0' },
                '60%': { transform: 'translateY(-5px) rotateX(-5deg)', opacity: '0.8' },
                '100%': { transform: 'translateY(0) rotateX(0)', opacity: '1' },
            },
            'tab-animate': {
                '0%': { transform: 'scale(0.95)', opacity: '0.7' },
                '50%': { transform: 'scale(1.05)', opacity: '1.2' },
                '100%': { transform: 'scale(1)', opacity: '1' },
            },
        },
    },
}

// 基础样式配置模块
const styleConfig = {
    extend: {
        perspective: {
            '500': '500px',
            '1000': '1000px',
        },
        transitionProperty: {
            'transform': 'transform',
        },
        colors: {
            primary: {
                DEFAULT: '#ec4899',
                foreground: '#ffffff',
            },
        },
        boxShadow: {
            '3xl': '0 0 50px rgba(236, 72, 153, 0.2)',
        },
    },
}

// 主配置
const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            ...animationConfig.extend,
            ...styleConfig.extend,
        },
    },
    plugins: [tailwindcssAnimate],
}

export default config