import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useUserContext } from '@/context/AuthContext'
import { sidebarLinks } from '@/constants'
import { INavLink } from '@/types'
import { Button } from '../ui/button'
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations'
import { useEffect } from 'react'

const LeftSidebar = () => {
  const { user } = useUserContext()
  const { pathname } = useLocation()
  const { mutate: signOut, isSuccess } = useSignOutAccount()
  const navigate = useNavigate()

  useEffect(() => {
    if (isSuccess) navigate('/sing-in')
  }, [isSuccess])

  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-11">
        <Link to="/" className="flex gap-3 items-center">
          <img
            src="/assets/images/logo.svg"
            alt="Logo"
            width={170}
            height={36}
          />
        </Link>

        <Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
          <img
            src={user.imageUrl || '/assets/images/profile-placeholder.svg'}
            alt="Profile"
            className="h-14 w-14 rounded-full"
          />
          <div className="flex flex-col">
            <p className="body-bold">{user.name}</p>
            <p className="small-rgular text-light-3">@{user.username}</p>
          </div>
        </Link>

        {/* Sidebar links */}
        <ul className="flex flex-col gap-6">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route

            return (
              <li
                key={link.label}
                className={`leftsidebar-link group ${
                  isActive && 'bg-primary-500'
                }`}
              >
                <NavLink
                  to={link.route}
                  className="flex gap-4 items-center p-4"
                >
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`group-hover:invert-white ${
                      isActive && 'invert-white'
                    }`}
                  />
                  {link.label}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </div>

      <Button
        variant="ghost"
        className="shad-button_ghost"
        onClick={() => signOut()}
      >
        <img src="/assets/icons/logout.svg" alt="logout" />
        <p className="small-medium lg:base-medium">Logout</p>
      </Button>
    </nav>
  )
}
export default LeftSidebar
