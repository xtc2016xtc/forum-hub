import { useState, useEffect, memo } from "react";
import {Particle} from "@/types";



/**
 * 生成初始粒子数据的辅助函数
 * @description 独立封装，逻辑清晰，可复用
 */
const generateInitialParticles = (): Particle[] => {
    return Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 0.2 + 0.05,
        color: ['#ec4899', '#8b5cf6', '#3b82f6'][Math.floor(Math.random() * 3)],
    }));
};

/**
 * 粒子装饰组件
 * @description memo优化，避免父组件重渲染导致的重复渲染
 */
export const ParticleDecoration = memo(() => {
    // 核心修复：把粒子数据生成逻辑直接放到 useState 初始值里，避免 effect 内同步 setState
    const [particles, setParticles] = useState<Particle[]>(generateInitialParticles);

    useEffect(() => {
        let animationId: number;
        // 粒子动画循环
        const animate = () => {
            setParticles(prev =>
                prev.map(p => ({
                    ...p,
                    y: p.y + p.speed,
                    x: p.x + Math.sin(p.y / 50) * 0.5,
                    ...(p.y > 100 && { y: 0, x: Math.random() * 100 }),
                }))
            );
            animationId = requestAnimationFrame(animate);
        };
        animationId = requestAnimationFrame(animate);

        // 清理动画帧，避免内存泄漏
        return () => cancelAnimationFrame(animationId);
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {particles.map(p => (
                <div
                    key={p.id}
                    className="absolute rounded-full opacity-70"
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        backgroundColor: p.color,
                        boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
                    }}
                />
            ))}
        </div>
    );
});

// 组件显示名，方便调试
ParticleDecoration.displayName = "ParticleDecoration";