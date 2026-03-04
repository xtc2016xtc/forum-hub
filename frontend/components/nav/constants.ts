import {NavItem} from "@/types";


/** 本地兜底导航菜单数据 */
export const DEFAULT_NAV_ITEMS: NavItem[] = [
    { label: "首页", href: "/" },
    {
        label: "活动",
        href: "/activities",
        children: [
            { label: "最新活动", href: "/activities/latest" },
            { label: "往期活动", href: "/activities/history" },
            { label: "专属福利", href: "/activities/benefits" },
        ],
    },
    { label: "关键资讯", href: "/news" },
    { label: "内容专区", href: "/content" },
];

/** 导航栏接口地址 */
export const NAV_API_URL = "http://localhost:8000/api/nav";

/** 动画配置常量 */
export const ANIMATION_CONFIG = {
    SLOW_PULSE_DURATION: "6s",
    BOUNCE_DURATION: "0.7s",
    TAB_ANIMATION_DURATION: "0.5s",
    TRANSITION_BASE: "700ms",
} as const;