/**
 * Mocks the window.scrollTo method
 */
export class MockWindowScrollTo {
  constructor () {
    this.scrollX = 0
    this.scrollY = 0
  }

  scrollTo (x, y) {
    this.scrollX = x
    this.scrollY = y
  }

  static replaceForTest (test, global) {
    const originalScrollTo = global.window.scrollTo

    test.before('Mock window.scrollTo', (t) => {
      global.window.scrollTo = new MockWindowScrollTo().scrollTo
    })

    test.after.always('Restore window.scrollTo', (t) => {
      global.window.scrollTo = originalScrollTo
    })
  }
}
