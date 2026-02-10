
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface LoginModalProps {
    isOpen: boolean
    onClose: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const [activeTab, setActiveTab] = useState<'sms' | 'password'>('sms')
    const [phone, setPhone] = useState('')
    const [code, setCode] = useState('')
    const [password, setPassword] = useState('')
    const [agree, setAgree] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    if (!isOpen) return null

    const handleLogin = async () => {
        if (!agree) return
        setLoading(true)
        // 模拟登录
        await new Promise(resolve => setTimeout(resolve, 800))
        document.cookie = 'auth_token=user_logged_in; path=/; max-age=86400'
        setLoading(false)
        onClose()
        router.refresh()
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* 遮罩层 */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            {/* 弹窗主体 */}
            <div className="relative bg-white rounded-lg w-[480px] shadow-xl overflow-hidden">
                {/* 关闭按钮 */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* 顶部扫码登录按钮 */}
                <div className="absolute top-4 left-4">
                    <button className="text-xs px-2 py-1 border border-blue-500 text-blue-500 rounded hover:bg-blue-50">
                        扫码登录
                    </button>
                </div>

                {/* 头部 Logo */}
                <div className="pt-12 pb-4 text-center">
                    <Image
                        src="https://uploadstatic.mihoyo.com/contentweb/20220921/2022092114405238432.png"
                        alt="miHoYo"
                        className={"h-8 mx-auto"}
                        width={1}
                    />
                    <p className="text-xs text-gray-400 mt-1">TECH OTAKUS SAVE THE WORLD</p>
                </div>

                {/* 标签页 */}
                <div className="flex border-b">
                    <button
                        onClick={() => setActiveTab('sms')}
                        className={`flex-1 py-3 text-sm font-medium ${activeTab === 'sms' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                    >
                        短信登录
                    </button>
                    <button
                        onClick={() => setActiveTab('password')}
                        className={`flex-1 py-3 text-sm font-medium ${activeTab === 'password' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                    >
                        密码登录
                    </button>
                </div>

                {/* 表单内容 */}
                <div className="p-6">
                    {activeTab === 'sms' ? (
                        <div className="space-y-4">
                            <div className="flex items-center border rounded-md overflow-hidden">
                                <span className="px-3 py-2 bg-gray-50 text-sm text-gray-600 border-r">+86</span>
                                <input
                                    type="tel"
                                    placeholder="手机号"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="flex-1 px-3 py-2 outline-none text-sm"
                                />
                            </div>

                            <div className="flex items-center border rounded-md overflow-hidden">
                                <input
                                    type="text"
                                    placeholder="验证码"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="flex-1 px-3 py-2 outline-none text-sm"
                                />
                                <button className="px-3 py-2 text-sm text-blue-500 hover:bg-blue-50">
                                    获取验证码
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="border rounded-md overflow-hidden">
                                <input
                                    type="tel"
                                    placeholder="手机号/邮箱"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full px-3 py-2 outline-none text-sm"
                                />
                            </div>
                            <div className="border rounded-md overflow-hidden">
                                <input
                                    type="password"
                                    placeholder="密码"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3 py-2 outline-none text-sm"
                                />
                            </div>
                        </div>
                    )}

                    {/* 用户协议 */}
                    <div className="flex items-start gap-2 mt-4">
                        <input
                            type="checkbox"
                            id="agree"
                            checked={agree}
                            onChange={(e) => setAgree(e.target.checked)}
                            className="mt-1"
                        />
                        <label htmlFor="agree" className="text-xs text-gray-500">
                            已阅读并同意《米哈游用户协议》《米哈游隐私政策》，未注册的手机号验证通过将自动注册
                        </label>
                    </div>

                    {/* 登录按钮 */}
                    <button
                        onClick={handleLogin}
                        disabled={!agree || loading}
                        className="w-full py-2.5 mt-4 bg-gray-200 text-gray-400 rounded-md disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {loading ? '登录中...' : '登录'}
                    </button>

                    {/* 遇到问题 */}
                    <div className="text-center mt-4">
                        <a href="#" className="text-xs text-blue-500 hover:underline">遇到问题</a>
                    </div>
                </div>
            </div>
        </div>
    )
}