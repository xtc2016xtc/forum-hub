import { useState, useEffect } from "react";

/**
 * 导航栏滚动状态Hook
 * @returns isScrolled 页面是否滚动超过20px
 */
export const useNavScroll = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // 批量更新，避免多次渲染，解决setState级联渲染警告
            window.requestAnimationFrame(() => {
                setIsScrolled(window.scrollY > 20);
            });
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        // 清理事件监听，避免内存泄漏
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return isScrolled;
};