
// 定义导航菜单类型 Navbar
export interface NavItem {
    label: string;
    href: string;
    children?: NavItem[];
}

//ParticleDecoration.tsx // 粒子类型定义
export interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    speed: number;
    color: string;
}
