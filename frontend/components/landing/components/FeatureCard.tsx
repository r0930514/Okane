import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    iconColor?: string;
}

function FeatureCard({ icon: Icon, title, description, iconColor = "text-blue-600" }: FeatureCardProps) {
    return (
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 gap-2">
            <CardHeader className="text-center pb-2">
                <div className="flex justify-center mb-4">
                    <Icon size={48} className={iconColor} />
                </div>
                <h3 className="text-lg font-semibold">{title}</h3>
            </CardHeader>
            <CardContent className="text-center pt-0">
                <p className="text-gray-600">
                    {description}
                </p>
            </CardContent>
        </Card>
    );
}

export default FeatureCard;