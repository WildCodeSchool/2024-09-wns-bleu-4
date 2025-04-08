import 'vitest-axe/extend-expect'
import 'vitest-canvas-mock'
import { axe } from "vitest-axe";
import * as matchers from "vitest-axe/matchers"
import { expect, afterEach, afterAll } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

expect.extend(matchers);

// runs a clean after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
})

afterAll(async(context) => {
  try {
    const { html } = await import(context.name.replace('src', '@'))
    const { container } = render(html)
    const results = await axe(container)
    //@ts-expect-error: ¯\_(ツ)_/¯
    expect(results).toHaveNoViolations()
  } catch (e) {
    throw new Error(e)
  }
})
