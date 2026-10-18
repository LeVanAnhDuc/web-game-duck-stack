// @vitest-environment jsdom
import { act, createRef } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { I18nProvider, type Locale } from '@/i18n'

const auth = vi.hoisted(() => ({ value: {} as Record<string, unknown> }))
vi.mock('@/hooks/useDuckerAuth', () => ({ useDuckerAuth: () => auth.value }))

import { AccountButton } from './index'

const base = {
  enabled: true,
  profileUrl: 'http://localhost:3000/profile',
  signIn: vi.fn(),
  signOut: vi.fn(),
}

let host: HTMLDivElement
let root: Root

function mount(locale: Locale, onOpen = vi.fn()) {
  const buttonRef = createRef<HTMLButtonElement>()
  act(() => {
    root.render(
      <I18nProvider locale={locale}>
        <AccountButton onOpen={onOpen} buttonRef={buttonRef} />
      </I18nProvider>,
    )
  })
  return { onOpen, buttonRef }
}

const byLabel = (label: string) => host.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`)

beforeEach(() => {
  ;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
  host = document.createElement('div')
  document.body.appendChild(host)
  root = createRoot(host)
  base.signIn.mockClear()
  base.signOut.mockClear()
})

afterEach(() => {
  act(() => root.unmount())
  host.remove()
})

describe('AccountButton', () => {
  it('renders nothing when the feature is disabled', () => {
    auth.value = { ...base, enabled: false, status: 'idle', profile: null }
    mount('en')
    expect(host.innerHTML).toBe('')
  })

  it('shows an icon-only sign-in button when signed out and starts login on click', () => {
    auth.value = { ...base, status: 'signed-out', profile: null }
    mount('en')
    const button = byLabel('Sign in')!
    expect(button.className).toContain('icon-btn')
    act(() => button.click())
    expect(base.signIn).toHaveBeenCalledOnce()
  })

  it('disables the button while signing in', () => {
    auth.value = { ...base, status: 'loading', profile: null }
    mount('en')
    const button = byLabel('Signing in…')!
    expect(button.disabled).toBe(true)
    expect(button.getAttribute('aria-busy')).toBe('true')
  })

  it('is an inert button of the same kind while idle', () => {
    auth.value = { ...base, status: 'idle', profile: null }
    mount('en')
    const button = byLabel('Sign in')!
    expect(button.disabled).toBe(true)
    expect(button.className).toContain('icon-btn')
    act(() => button.click())
    expect(base.signIn).not.toHaveBeenCalled()
  })

  it('falls back to the initial when the picture fails to load', () => {
    auth.value = { ...base, status: 'signed-in', profile: { sub: 'u1', name: 'Le Van Duc', picture: 'http://x/a.png' } }
    mount('en')
    const img = host.querySelector('img')!
    expect(img.getAttribute('referrerpolicy')).toBe('no-referrer')
    act(() => {
      img.dispatchEvent(new Event('error'))
    })
    expect(host.querySelector('img')).toBeNull()
    expect(host.querySelector('.avatar')?.textContent).toBe('L')
  })

  it('uses the Vietnamese labels in the vi locale', () => {
    auth.value = { ...base, status: 'signed-out', profile: null }
    mount('vi')
    expect(byLabel('Đăng nhập')).not.toBeNull()
  })

  it('shows the avatar trigger when signed in and opens the account dialog', () => {
    auth.value = { ...base, status: 'signed-in', profile: { sub: 'u1', name: 'Le Van Duc', email: 'duc@ducker.id' } }
    const { onOpen } = mount('en')
    const trigger = byLabel('Ducker ID account')!
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog')
    expect(trigger.textContent).toBe('L')
    act(() => trigger.click())
    expect(onOpen).toHaveBeenCalledOnce()
  })

  it('shows the picture instead of the initial when there is one', () => {
    auth.value = {
      ...base,
      status: 'signed-in',
      profile: { sub: 'u1', name: 'Le Van Duc', picture: 'http://localhost:3000/a.png' },
    }
    mount('en')
    expect(host.querySelector('img')?.getAttribute('src')).toBe('http://localhost:3000/a.png')
  })
})
