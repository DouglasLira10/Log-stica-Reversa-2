import React from 'react';

// Replaces the image logo with a styled text component to match the brand image.
const CorreiosLogo: React.FC<{className?: string}> = ({ className }) => (
    <div className={`flex justify-center items-center bg-[#FFC72C] p-2 ${className}`}>
        <div
            className="text-[#004d9c] font-bold text-4xl tracking-wider"
            style={{ fontFamily: "'Titillium Web', sans-serif" }}
        >
            Correios
        </div>
    </div>
);

export default CorreiosLogo;
