import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    return (
        <aside className="w-64 bg-[#0a0a0a] border-r border-white/10 p-6 flex flex-col gap-10">
            <div className="text-2xl font-bold tracking-tight text-white">
                Inflecto <span className="font-normal opacity-60">CMS</span>
            </div>

            <nav className="flex flex-col gap-2">
                <NavLink
                    to="/"
                    end
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-md text-sm border transition-all duration-200 ${isActive
                            ? 'bg-white text-black border-white'
                            : 'bg-transparent text-[#a0a0a0] border-transparent hover:bg-[#111111] hover:text-white hover:border-white/10'
                        }`
                    }
                >
                    <span className={({ isActive }) =>
                        `w-1.5 h-1.5 rounded-full ${isActive ? 'bg-black' : 'bg-[#a0a0a0]'}`
                    } />
                    <span>Dashboard</span>
                </NavLink>

                <NavLink
                    to="/blogs"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-md text-sm border transition-all duration-200 ${isActive
                            ? 'bg-white text-black border-white'
                            : 'bg-transparent text-[#a0a0a0] border-transparent hover:bg-[#111111] hover:text-white hover:border-white/10'
                        }`
                    }
                >
                    {({ isActive }) => (
                        <>
                            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-black' : 'bg-[#a0a0a0]'}`} />
                            <span>Blogs</span>
                        </>
                    )}
                </NavLink>

                <NavLink
                    to="/careers"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-md text-sm border transition-all duration-200 ${isActive
                            ? 'bg-white text-black border-white'
                            : 'bg-transparent text-[#a0a0a0] border-transparent hover:bg-[#111111] hover:text-white hover:border-white/10'
                        }`
                    }
                >
                    {({ isActive }) => (
                        <>
                            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-black' : 'bg-[#a0a0a0]'}`} />
                            <span>Careers</span>
                        </>
                    )}
                </NavLink>
            </nav>

            <div className="mt-auto pt-4 border-t border-white/5 text-xs text-[#666666]">
                Connected to: <code className="bg-[#111111] px-2 py-1 rounded text-[#e5e5e5] text-[0.7rem]">/api/blogs</code>
            </div>
        </aside>
    );
};

export default Sidebar;
