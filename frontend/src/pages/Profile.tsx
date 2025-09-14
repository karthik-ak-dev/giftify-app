import React from 'react';

const Profile: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <div className="glass-card p-8">
                    <h1 className="text-3xl font-bold neon-text mb-8">Profile</h1>

                    <div className="space-y-6">
                        <div className="skeleton h-20 rounded-lg"></div>
                        <div className="skeleton h-12 rounded-lg"></div>
                        <div className="skeleton h-12 rounded-lg"></div>
                        <div className="skeleton h-12 rounded-lg"></div>
                        <div className="skeleton h-10 rounded-lg w-32"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile; 