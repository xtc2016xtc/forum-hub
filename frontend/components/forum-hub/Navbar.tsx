// app/components/Navbar.tsx
'use client'

import { useState } from 'react'
import { LoginModal } from '@/components/login/LoginModal'
import Image from "next/image";

export function Navbar() {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

    return (
        <>
            <nav className="bg-[#1e2129] text-white h-14 flex items-center px-6 justify-between sticky top-0 z-50">
                {/* 左侧 Logo 和切换器 */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Image
                            src="https://uploadstatic.mihoyo.com/contentweb/20220921/2022092114405238432.png"
                            alt="米游社"
                            className="h-8"
                            width={1}
                            height={1}
                        />
                        <span className="text-sm font-medium">米游社 · 原神</span>
                        <svg className="w-4 h-4 opacity-70" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>

                {/* 中间导航菜单 */}
                <div className="flex items-center gap-6 text-sm font-medium">
                    <a href="#" className="text-white hover:text-blue-400 transition-colors">首页</a>
                    <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">酒馆</a>
                    <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">攻略</a>
                    <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">官方</a>
                    <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">观测枢</a>
                    <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">米游铺</a>
                    <div className="flex items-center gap-1 text-gray-300 hover:text-blue-400 transition-colors cursor-pointer">
                        <span>更多</span>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>

                {/* 右侧搜索和用户区 */}
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="搜索"
                            className="bg-[#2a2d34] rounded-full px-4 py-1.5 text-sm w-48 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <button
                        onClick={() => setIsLoginModalOpen(true)}
                        className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden"
                    >
                        <Image
                            src="https://uploadstatic.mihoyo.com/contentweb/20220921/2022092114405238432.png"
                            alt="用户头像"
                            width={1}
                            height={1}
                            className="w-full h-full object-cover"
                        />
                    </button>
                </div>
            </nav>

            {/* 登录弹窗 */}
            <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
        </>
    )
}