"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { Menu, ChevronDown, X, Sparkles, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

// shadcn/ui 组件导入
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

// 自定义Hook与子组件导入
import { useNavScroll } from "./hooks/useNavScroll";
import { useNavGlow } from "./hooks/useNavGlow";
import { useNavData } from "./hooks/useNavData";
import { ParticleDecoration } from "./ParticleDecoration";
import {NavItem} from "@/types";


const Navbar = () => {
    // 导航栏容器Ref
    const navRef = useRef<HTMLDivElement>(null);

    // 状态管理
    const [activeTab, setActiveTab] = useState<string>("首页");
    const [expandedMobileItems, setExpandedMobileItems] = useState<Record<string, boolean>>({});

    // 自定义Hook调用
    const isScrolled = useNavScroll();
    const glowPos = useNavGlow(navRef);
    const navItems = useNavData();

    // 切换移动端子菜单展开/收起
    const toggleMobileItem = (href: string) => {
        setExpandedMobileItems(prev => ({
            ...prev,
            [href]: !prev[href],
        }));
    };

    // 切换激活Tab
    const handleTabChange = (label: string) => {
        setActiveTab(label);
    };

    // 渲染桌面端导航菜单（核心修复下拉菜单样式）
    const renderDesktopNavItems = (items: NavItem[]) => {
        return items.map((item) => (
            <NavigationMenuItem
                key={item.href}
                className="group relative overflow-hidden"
            >
                {/* 3D悬浮底座效果 */}
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 via-purple-500/5 to-blue-500/5
                        transform transition-all duration-700
                        group-hover:translate-y-[-2px] group-hover:rotate-x-5
                        rounded-lg blur-sm"
                />

                {item.children ? (
                    <>
                        {/* 隐藏组件默认箭头，解决重复箭头问题 */}
                        <NavigationMenuTrigger
                            className={cn(
                                "relative h-14 px-8 py-2 text-lg font-semibold rounded-xl transition-all duration-700",
                                "hover:bg-gradient-to-r from-purple-900/30 to-pink-900/30",
                                "border border-purple-500/20 hover:border-pink-500/50",
                                "overflow-hidden flex items-center gap-2 [&>svg]:hidden",
                                "data-[state=open]:bg-gradient-to-r data-[state=open]:from-purple-900/40 data-[state=open]:to-pink-900/40",
                                "data-[state=open]:border-pink-500/50 data-[state=open]:text-pink-400",
                                activeTab === item.label ? "text-pink-400 shadow-lg shadow-pink-500/20" : "text-white/80"
                            )}
                            onClick={() => handleTabChange(item.label)}
                        >
                            <Sparkles className="h-5 w-5 transition-all duration-500 group-hover:rotate-360" />
                            {item.label}
                            {/* 自定义箭头，展开自动旋转180度 */}
                            <ChevronDown
                                className="h-5 w-5 transition-transform duration-700 group-data-[state=open]:rotate-180"
                                fill="currentColor"
                            />

                            {/* 霓虹描边动画 */}
                            <div className="absolute inset-0 border border-pink-500/0 group-hover:border-pink-500/80
                              rounded-xl transition-all duration-700" />

                            {/* 内部流光扫过效果 */}
                            <div className="absolute -right-full top-0 h-full w-full bg-white/10
                              transform skew-x-12 transition-all duration-1000
                              group-hover:translate-x-[200%]" />
                        </NavigationMenuTrigger>

                        {/* 核心修复：彻底覆盖默认样式，适配暗黑主题，消除白色空白块 */}
                        <NavigationMenuContent
                            className="w-auto p-0 mt-2 overflow-hidden rounded-2xl
                        border border-pink-500/30 backdrop-blur-2xl
                        shadow-2xl shadow-pink-500/20 transform transition-all duration-700
                        hover:translate-y-[-5px] hover:rotate-x-5
                        !bg-black/95 !text-white" // 强制覆盖默认浅色样式
                        >
                            <div className="relative p-6">
                                <ParticleDecoration />
                                <ul className="grid w-[500px] gap-4 p-2 md:w-[600px] m-0 list-none">
                                    {item.children.map((child) => (
                                        <li
                                            key={child.href}
                                            className="list-none relative overflow-hidden m-0 p-0"
                                        >
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    href={child.href}
                                                    className="w-full px-8 py-5 rounded-xl text-lg transition-all duration-500
                                    hover:bg-gradient-to-r from-purple-900/40 to-pink-900/40
                                    hover:text-white hover:translate-x-3 flex items-center gap-3
                                    !text-white !no-underline" // 强制覆盖默认样式
                                                    onClick={() => handleTabChange(child.label)}
                                                >
                                                    <Globe className="h-4 w-4 text-yellow-400 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                                                    {child.label}
                                                    {/* 底部进度条效果 */}
                                                    <span className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-pink-500 to-purple-500
                                           transition-all duration-500 hover:w-full" />
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>
                                    ))}
                                </ul>

                                {/* 下拉菜单底部渐变装饰条 */}
                                <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500" />
                            </div>
                        </NavigationMenuContent>
                    </>
                ) : (
                    <NavigationMenuLink asChild>
                        <Link
                            href={item.href}
                            className={cn(
                                "relative flex h-14 items-center px-8 py-2 text-lg font-semibold rounded-xl transition-all duration-700",
                                "hover:bg-gradient-to-r from-purple-900/30 to-pink-900/30",
                                "border border-purple-500/20 hover:border-pink-500/50",
                                activeTab === item.label
                                    ? "text-pink-400 shadow-lg shadow-pink-500/20"
                                    : "text-white/80 hover:text-white",
                                "overflow-hidden !no-underline"
                            )}
                            onClick={() => handleTabChange(item.label)}
                        >
                            <Globe className="h-5 w-5 mr-2 transition-all duration-500 group-hover:rotate-180" />
                            {item.label}

                            {/* 霓虹描边效果 */}
                            <div className="absolute inset-0 border border-pink-500/0 hover:border-pink-500/80
                              rounded-xl transition-all duration-700" />

                            {/* 内部流光扫过效果 */}
                            <div className="absolute -right-full top-0 h-full w-full bg-white/10
                              transform skew-x-12 transition-all duration-1000
                              hover:translate-x-[200%]" />
                        </Link>
                    </NavigationMenuLink>
                )}
            </NavigationMenuItem>
        ));
    };

    // 渲染移动端导航菜单
    const renderMobileNavItem = (item: NavItem) => (
        <div
            key={item.href}
            className="border-b border-purple-900/30 pb-6 last:border-0 last:pb-0 relative overflow-hidden"
        >
            <div className="flex items-center justify-between">
                <Link
                    href={item.href}
                    className={cn(
                        "flex items-center gap-3 w-full px-6 py-4 rounded-2xl text-xl font-medium transition-all duration-500",
                        "hover:bg-gradient-to-r from-purple-900/40 to-pink-900/40 hover:text-pink-400",
                        activeTab === item.label ? "text-pink-400 bg-purple-900/20" : "text-white/80",
                        "!no-underline"
                    )}
                    onClick={() => handleTabChange(item.label)}
                >
                    <Sparkles className="h-5 w-5 text-pink-500" />
                    {item.label}
                </Link>

                {item.children && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleMobileItem(item.href)}
                        className="h-12 w-12 rounded-full bg-purple-900/20 hover:bg-pink-900/30
                      hover:text-pink-400 transition-all duration-500 hover:scale-125 hover:rotate-180
                      border border-pink-500/20"
                    >
                        <ChevronDown
                            className={`h-6 w-6 text-pink-400 transition-transform duration-700 ${expandedMobileItems[item.href] ? "rotate-180 scale-125" : ""}`}
                            fill="currentColor"
                        />
                    </Button>
                )}
            </div>

            {/* 移动端展开的子菜单 */}
            {item.children && expandedMobileItems[item.href] && (
                <div className="mt-4 pl-8 flex flex-col gap-3 animate-in bounce-in-up duration-700">
                    {item.children.map((child) => (
                        <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                                "px-6 py-4 rounded-xl text-lg text-gray-300 transition-all duration-500",
                                "hover:bg-gradient-to-r from-purple-900/40 to-pink-900/40 hover:text-white hover:translate-x-4",
                                "relative overflow-hidden !no-underline",
                                activeTab === child.label ? "text-pink-400 bg-purple-900/20" : ""
                            )}
                            onClick={() => handleTabChange(child.label)}
                        >
                            {child.label}
                            {/* 侧边霓虹线装饰 */}
                            <span className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-pink-500 to-purple-500
                               opacity-0 hover:opacity-100 transition-all duration-500" />
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <header
            className={cn(
                "sticky top-0 z-50 w-full transition-all duration-700 ease-in-out perspective-1000",
                isScrolled
                    ? "border-b border-pink-500/20 bg-black/98 backdrop-blur-3xl shadow-xl shadow-pink-500/10"
                    : "border-b border-transparent bg-black/90 backdrop-blur-xl shadow-none"
            )}
            ref={navRef}
        >
            {/* 全局鼠标跟随流光背景 */}
            <div
                className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 pointer-events-none"
                style={{
                    backgroundPosition: `${glowPos.x}% ${glowPos.y}%`,
                }}
            />

            <div className="container mx-auto flex h-24 items-center justify-between px-8 md:px-12 relative z-10">
                {/* 品牌Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-4 font-bold text-3xl tracking-wider relative group/logo perspective-500 !no-underline"
                    onClick={() => handleTabChange("首页")}
                >
                    <Sparkles className="h-8 w-8 text-pink-400 animate-pulse transform transition-all duration-700 group-hover/logo:rotate-y-180" />
                    <span
                        className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400
                       relative transform transition-all duration-700 group-hover/logo:scale-110 group-hover/logo:rotate-x-10"
                    >
            雅成论坛
            <span className="absolute inset-0 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400
                             blur-md opacity-80 group-hover/logo:opacity-100 transition-opacity duration-700" />
            <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-pink-400 to-purple-400
                             scale-x-0 group-hover/logo:scale-x-100 transition-transform duration-700 origin-left" />
          </span>
                </Link>

                {/* 桌面端导航（核心修复：补充Viewport，控制下拉容器样式） */}
                <nav className="hidden md:flex items-center gap-4">
                    <NavigationMenu className="relative">
                        <NavigationMenuList className="relative z-10 flex items-center gap-4 m-0 p-0 list-none">
                            {renderDesktopNavItems(navItems)}
                        </NavigationMenuList>

                        {/* 核心修复：自定义Viewport，彻底消除白色背景 */}
                        <NavigationMenuViewport
                            className="!bg-transparent !border-none !shadow-none mt-2"
                        />

                        {/* 导航栏底部霓虹条 */}
                        <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-pink-500/0 via-purple-500/90 to-blue-500/0
                            animate-pulse-slow transform perspective-1000 rotate-x-10" />
                    </NavigationMenu>
                </nav>

                {/* 移动端导航 */}
                <Sheet>
                    <SheetTrigger asChild className="md:hidden">
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="打开导航菜单"
                            className="rounded-full h-14 w-14 bg-purple-900/20 hover:bg-pink-900/30
                        transition-all duration-700 hover:scale-125 hover:rotate-360
                        border border-pink-500/30"
                        >
                            <Menu className="h-7 w-7 text-pink-400" />
                            <span className="sr-only">打开菜单</span>
                        </Button>
                    </SheetTrigger>

                    <SheetContent
                        side="right"
                        className="w-[95%] sm:w-[420px] border-l border-pink-500/30 bg-black/98
                      backdrop-blur-3xl shadow-3xl shadow-pink-500/10 p-0"
                    >
                        {/* 移动端导航头部 */}
                        <div className="flex items-center justify-between px-8 py-8 border-b border-pink-500/20 relative">
                            <SheetTitle className="text-3xl font-bold flex items-center gap-3 m-0 p-0">
                                <Sparkles className="h-7 w-7 text-pink-400 animate-pulse" />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400">
                  雅成论坛
                </span>
                            </SheetTitle>

                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-12 w-12 rounded-full bg-purple-900/20 hover:bg-pink-900/30
                            transition-all duration-500 hover:scale-125 hover:rotate-90"
                                >
                                    <X className="h-6 w-6 text-pink-400" />
                                </Button>
                            </SheetTrigger>
                        </div>

                        {/* 移动端导航内容 */}
                        <nav className="flex flex-col gap-0 px-8 py-8 relative">
                            <ParticleDecoration />
                            {navItems.map(renderMobileNavItem)}
                        </nav>

                        {/* 移动端底部霓虹条 */}
                        <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 animate-pulse-slow" />
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
};

export default Navbar;