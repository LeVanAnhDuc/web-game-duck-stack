// @vitest-environment jsdom
import { act, useCallback, useRef, useState } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { I18nProvider } from '@/i18n'

const auth = vi.hoisted(() => ({ value: {} as Record<string, unknown> }))
vi.mock('@/hooks/useDuckerAuth', () => ({ useDuckerAuth: () => auth.value }))

import { AccountButton } from '../../components/AccountButton'
import { AccountDialog } from './index'

const base = {
  enabled: true,
  profileUrl: 'http://localhost:3000/profile',
  signIn: vi.fn(),
  signOut: vi.fn(),
  status: 'signed-in',
  profile: { sub: 'u1', name: 'Le Van Anh Duc', email: 'duc@ducker.id' },
}

let host: HTMLDivElement
let root: Root
const onClose = vi.fn()

function mount() {
  act(() => {
    root.render(
      <I18nProvider locale="en">
        <AccountDialog onClose={onClose} />
      </I18nProvider>,
    )
  })
}

/** The real slot: AccountButton + AccountDialog, wired as Play wires them. */
function Slot() {
  const [open, setOpen] = useState(false)
  const [, tick] = useState(0)
  const ref = useRef<HTMLButtonElement | null>(null)
  const focusAccount = useCallback(() => ref.current?.focus(), [])
  base.signOut.mockImplementation(() => {
    auth.value = { ...base, status: 'signed-out', profile: null }
    tick((n) => n + 1)
  })
  return (
    <I18nProvider locale="en">
      <AccountButton onOpen={() => setOpen(true)} buttonRef={ref} />
      {open ? <AccountDialog onClose={() => setOpen(false)} onFocusFallback={focusAccount} /> : null}
    </I18nProvider>
  )
}

beforeEach(() => {
  ;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
  host = document.createElement('div')
  document.body.appendChild(host)
  root = createRoot(host)
  auth.value = base
  onClose.mockClear()
  base.signOut.mockClear()
})

afterEach(() => {
  act(() => root.unmount())
  host.remove()
})

describe('AccountDialog', () => {
  it('is a modal dialog showing name, email and a profile link that opens a new tab', () => {
    mount()
    const dialog = host.querySelector('[role="dialog"]')!
    expect(dialog.getAttribute('aria-modal')).toBe('true')
    expect(dialog.getAttribute('aria-label')).toBe('Ducker ID account')
    expect(host.textContent).toContain('Le Van Anh Duc')
    expect(host.textContent).toContain('duc@ducker.id')
    const link = host.querySelector<HTMLAnchorElement>('a')!
    expect(link.textContent).toBe('Open Ducker ID profile')
    expect(link.getAttribute('href')).toBe('http://localhost:3000/profile')
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toBe('noopener noreferrer')
  })

  it('moves focus into the dialog on open', () => {
    mount()
    expect(host.contains(document.activeElement)).toBe(true)
  })

  it('closes on Escape', () => {
    mount()
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    })
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('closes on a click outside the panel, not inside it', () => {
    mount()
    act(() => host.querySelector<HTMLElement>('.modal')!.click())
    expect(onClose).not.toHaveBeenCalled()
    act(() => host.querySelector<HTMLElement>('.overlay')!.click())
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('signs out and closes', () => {
    mount()
    const signOut = [...host.querySelectorAll('button')].find((b) => b.textContent === 'Sign out')!
    act(() => signOut.click())
    expect(base.signOut).toHaveBeenCalledOnce()
    expect(onClose).toHaveBeenCalled()
  })

  it('Esc closes the dialog and focus returns to the avatar trigger', () => {
    act(() => root.render(<Slot />))
    const trigger = host.querySelector<HTMLButtonElement>('button[aria-label="Ducker ID account"]')!
    act(() => trigger.click())
    expect(host.querySelector('[role="dialog"]')).not.toBeNull()
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    })
    expect(host.querySelector('[role="dialog"]')).toBeNull()
    expect(document.activeElement).toBe(trigger)
  })

  it('after sign-out focus lands on the sign-in button, not on body', () => {
    act(() => root.render(<Slot />))
    act(() => host.querySelector<HTMLButtonElement>('button[aria-label="Ducker ID account"]')!.click())
    const signOut = [...host.querySelectorAll('button')].find((b) => b.textContent === 'Sign out')!
    act(() => signOut.click())
    const signIn = host.querySelector<HTMLButtonElement>('button[aria-label="Sign in"]')!
    expect(signIn).not.toBeNull()
    expect(document.activeElement).toBe(signIn)
    expect(document.activeElement).not.toBe(document.body)
  })

  it('renders nothing without a signed-in profile', () => {
    auth.value = { ...base, status: 'signed-out', profile: null }
    mount()
    expect(host.innerHTML).toBe('')
  })
})
