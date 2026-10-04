import { initialOf } from '@/auth/initials'
import type { DuckerProfile } from '@/auth/types'

/** Picture when Ducker ID has one, otherwise the first letter. Neutral chrome only. */
export function Avatar({ profile, large }: { profile: DuckerProfile; large?: boolean }) {
  return (
    <span className={large ? 'avatar avatar--lg' : 'avatar'} aria-hidden="true">
      {profile.picture ? <img src={profile.picture} alt="" referrerPolicy="no-referrer" /> : initialOf(profile)}
    </span>
  )
}
