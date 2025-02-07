'use client'

import React from 'react'
import Style from './navbar.module.css'
import Logo from '../../../public/images/payflix-logo.png'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { accountLogout } from '@/services/apiAccounts'
import { useSession } from 'next-auth/react'

export default function Navbar() {
    const { data: session, status } = useSession();
    const user = session?.user;

    const router = useRouter()

    const handleLogout = async () => {
        try {
          await accountLogout();
          toast.success('Logged out successfully!');
          router.push('/login'); 
        } catch (error) {
          toast.error('Error logging out!'); 
        }
    };

  return (
    <div className={Style.navbar}>
      <Image src={Logo} alt='' className={Style.logo} onClick={() => router.push('/')}/>
       <div className={Style.userMenu}>
           <Link href='/user-settings'>Settings</Link>
          <button className={Style.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
    </div>    
  )
}
