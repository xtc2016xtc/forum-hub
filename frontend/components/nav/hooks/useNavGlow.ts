import React, { useState, useEffect } from "react";

/**
 * 导航栏鼠标跟随流光Hook
 * @param containerRef 导航栏容器Ref（允许null，兼容useRef初始值）
 * @returns glowPos 流光位置坐标
 */
export const useNavGlow = (containerRef: React.RefObject<HTMLDivElement | null>) => {
    const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // 非空检查，确保current存在时才执行
            if (!containerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();
            // 批量更新，避免级联渲染
            window.requestAnimationFrame(() => {
                setGlowPos({
                    x: ((e.clientX - rect.left) / rect.width) * 100,
                    y: ((e.clientY - rect.top) / rect.height) * 100,
                });
            });
        };

        window.addEventListener("mousemove", handleMouseMove, { passive: true });
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [containerRef]);

    return glowPos;
};