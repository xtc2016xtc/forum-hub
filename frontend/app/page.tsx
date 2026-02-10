import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Home() {
    return (
        <div className="min-h-screen bg-background p-8">
            <h1 className="text-3xl font-bold mb-8 text-foreground">组件测试页面</h1>

            <div className="space-y-8">
                {/* 测试 1: Button 组件 */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-foreground">1. Button 组件测试</h2>
                    <div className="flex gap-4">
                        <Button variant="default">默认按钮</Button>
                        <Button variant="secondary">次要按钮</Button>
                        <Button variant="destructive">危险按钮</Button>
                        <Button variant="outline">轮廓按钮</Button>
                        <Button variant="ghost">幽灵按钮</Button>
                        <Button variant="link">链接按钮</Button>
                    </div>
                </div>

                {/* 测试 2: Input 组件 */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-foreground">2. Input 组件测试</h2>
                    <div className="space-y-4 max-w-md">
                        <Input placeholder="普通输入框" />
                        <Input type="email" placeholder="邮箱输入框" />
                        <Input type="password" placeholder="密码输入框" />
                        <Input disabled placeholder="禁用状态" />
                    </div>
                </div>

                {/* 测试 3: Avatar 组件 */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-foreground">3. Avatar 组件测试</h2>
                    <div className="flex gap-4">
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <Avatar>
                            <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <Avatar>
                            <AvatarImage src="/broken-image.jpg" />
                            <AvatarFallback>ER</AvatarFallback>
                        </Avatar>
                    </div>
                </div>

                {/* 测试 4: DropdownMenu 组件 */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-foreground">4. DropdownMenu 组件测试</h2>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">打开菜单</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>个人资料</DropdownMenuItem>
                            <DropdownMenuItem>设置</DropdownMenuItem>
                            <DropdownMenuItem>登出</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* 测试 5: 综合测试 */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-foreground">5. 综合组件测试</h2>
                    <div className="flex items-center gap-4 p-4 border-border border rounded-lg">
                        <Avatar>
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <Input className="flex-1" placeholder="输入评论..." />
                        <Button>发布</Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost">⋯</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>编辑</DropdownMenuItem>
                                <DropdownMenuItem>删除</DropdownMenuItem>
                                <DropdownMenuItem>分享</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </div>
    )
}