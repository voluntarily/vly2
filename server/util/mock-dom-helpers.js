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
}
