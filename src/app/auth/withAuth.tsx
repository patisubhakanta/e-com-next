import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
    const AuthenticatedComponent = (props: P) => {
        const router = useRouter();
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            const token = sessionStorage.getItem('token');
            if (!token) {
                router.push('/auth/signin');
            } else {
                setLoading(false);
            }
        }, [router]);

        if (loading) {
            return <div>Loading...</div>;
        }

        return <WrappedComponent {...props} />;
    };

    return AuthenticatedComponent;
};

export default withAuth;
