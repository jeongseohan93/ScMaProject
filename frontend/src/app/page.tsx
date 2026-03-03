import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * 
 * @returns 
 */
export default async function HomePage() {

  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken');

  if(token) {
    redirect('/feed');
  } else {
    redirect('/login');
  }
};
