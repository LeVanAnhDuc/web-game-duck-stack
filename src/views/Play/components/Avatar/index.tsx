import { useState } from 'react'
import { initialOf } from '@/auth/initials'
import type { DuckerProfile } from '@/auth/types'

/**
 * Picture when Ducker ID has one, otherwise (or when it fails to load) the first
 * letter. Neutral chrome only. The picture may live on another host, so no referrer.
 */
export function Avatar({ profile, large }: { profile: DuckerProfile; large?: boolean }) {
  const [broken, setBroken] = useState(false)
  return (
    <span className={large ? 'avatar avatar--lg' : 'avatar'} aria-hidden="true">
      {profile.picture && !broken ? (
        <img src={profile.picture} alt="" referrerPolicy="no-referrer" onError={() => setBroken(true)} />
      ) : (
        initialOf(profile)
      )}
    </span>
  )
}
