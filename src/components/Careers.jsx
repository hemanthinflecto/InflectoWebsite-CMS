import React from 'react';

const Careers = () => {
    return (
        <div className="bg-[#0a0a0a] rounded-lg border border-white/10 p-8">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <div className="text-lg font-semibold text-white">Careers</div>
                    <div className="text-sm text-[#a0a0a0] mt-2 leading-relaxed">
                        Static explanation / placeholder for future job posting integration.
                    </div>
                </div>
            </div>

            <p className="text-sm text-[#a0a0a0] leading-relaxed">
                This section is reserved for a future integration with a careers / ATS
                system. For now you can treat it as a static page to keep your team
                aligned on how roles will be published and managed.
            </p>
        </div>
    );
};

export default Careers;
