"use client"
import Logo from '@/components/lib/logo'
import { Button } from '@/components/ui/button'
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/nextjs'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LogOutIcon, Moon, MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import React from 'react'

const Header = () => {
    const {user} = useUser()
    const {theme, setTheme} = useTheme()
    const isDark = theme === 'dark'

  return (
    <div className="sticky top-0 left-0 right-0 z-8">
        <header className='bg-background h-16 border-b py-4'>
            <div className="w-full flex item-center justify-between mx-auto max-w-6xl">
                <Logo/>
                <div className="flex-1 hidden items-center justify-center gap-8 md:flex">
                    <Link 
                    href="/" className='text-muted-foreground text-sm'>
                        Home
                    </Link>
                </div>
                <div className="flex flex-1 item-center justify-end gap-3">
                    <Button 
                    variant="outline"
                    size="icon"
                    className='rounded-full relative size-8'
                    onClick={()=> setTheme(isDark ? 'light' : 'dark')}
                    >
                        <SunIcon
                        className={`absolute size-5 transition ${isDark ? 'scale-0' : 'scale-100'}`}
                        />
                        <MoonIcon
                        className={`absolute size-5 transition ${isDark ? 'scale-100' : 'scale-0'}`}
                        />
                    </Button>
            {user ? (
                <SignedIn >
                    <UserButton  />
                </SignedIn>
            ) : (
                <SignedOut>
                    <SignInButton mode="modal">
                        <Button
                          asChild
                          className="bg-primary text-primary-foreground  px-3 py-1.5 text-sm hover:bg-primary/70 transition "
                        >
                          <span>Sign In</span>
                        </Button>
                    </SignInButton>
                </SignedOut>

            )}
                </div>
            </div>
        </header>
    </div>
  )
}

export default Header