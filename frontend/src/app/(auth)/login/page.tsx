import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LoginPanel from './_components/LoginPanel';

export default async function LoginPage() {
    
    const cookieStore = await cookies();
    const token = cookieStore.get('accesToken');
    if( token ){
        redirect('/feed');
    }
    
    return (
        <main className="flex min-h-screen items-center justify-center bg-background">
            <LoginPanel />
        </main>
    )
}