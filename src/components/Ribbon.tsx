import React from "react";
import { cn } from "@/lib/utils";

interface RibbonProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    color?: string;
    bg?: string;
    cutout?: string;
    fontSize?: string;
}

const Ribbon: React.FC<RibbonProps> = ({
    children,
    color,
    bg,
    cutout,
    fontSize,
    className,
    style,
    ...props
}) => {
    const customStyles: React.CSSProperties = {
        ...style,
        ...((color || bg) && { "--ribbon-bg": color || bg }),
        ...(cutout && { "--r": cutout }),
        ...(fontSize && { fontSize }),
    } as React.CSSProperties;

    return (
        <div
            className={cn("ribbon", className)}
            style={customStyles}
            {...props}
        >
            {children}
        </div>
    );
};

export default Ribbon;
