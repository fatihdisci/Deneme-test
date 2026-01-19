import * as LucideIcons from 'lucide-react';

// Map of service slugs to their corresponding Lucide icon names
const serviceIconMap: Record<string, keyof typeof LucideIcons> = {
    'aile-ve-bosanma': 'Heart',
    'bilisim-hukuku': 'MonitorSmartphone',
    'ceza-hukuku': 'Gavel',
    'gayrimenkul-hukuku': 'Home',
    'icra-hukuku': 'FileText',
    'idare-hukuku': 'Landmark',
    'is-hukuku': 'Briefcase',
    'sirket-danismanligi': 'Building2',
    'ticaret-hukuku': 'Scale',
};

interface ServiceIconProps {
    slug: string;
    className?: string;
    size?: number;
}

export function ServiceIcon({ slug, className = '', size = 48 }: ServiceIconProps) {
    const iconName = serviceIconMap[slug] || 'Scale';
    const IconComponent = LucideIcons[iconName] as React.ComponentType<{ className?: string; size?: number }>;

    if (!IconComponent) {
        return <LucideIcons.Scale className={className} size={size} />;
    }

    return <IconComponent className={className} size={size} />;
}
