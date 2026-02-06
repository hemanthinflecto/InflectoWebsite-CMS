import React from 'react';

const Dashboard = () => {
    return (
        <div className="bg-[#0a0a0a] rounded-lg border border-white/10 p-8">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <div className="text-lg font-semibold text-white">Overview</div>
                    <div className="text-sm text-[#a0a0a0] mt-2 leading-relaxed">
                        Lightweight CMS for Inflecto marketing content.
                    </div>
                </div>
                <span className="inline-flex items-center rounded px-3 py-1 text-xs bg-[#111111] text-[#a0a0a0] border border-white/10 font-medium">
                    Internal · CMS
                </span>
            </div>

            <p className="text-sm text-[#a0a0a0] leading-relaxed">
                Use the navigation on the left to manage your blog content. New posts
                created here will automatically flow into the public{" "}
                <strong className="text-white">Blog</strong> page on the main Inflecto website.
            </p>
        </div>
    );
};

export default Dashboard;
