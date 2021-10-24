# Notes on using the AntD menu and Layout.Header

As of Antd 4.0 (2021) menus can now collapse into a ... vertical menu as the screen size decreases. This allows us to replace the Navigation component that used to do this job.

However this does depend on the styles and layout of the menu not overriding that provided by the frame . For example adding a float: right to the menu bar breaks the folding.

Also the component uses useLayoutEffect to determine the available space. This does not give accurate results when run serverside so to avoid a flash of unused content we have load the Header dynamically.

This is done in _app.js and does cause a slight delay in the menu appearance on the screen.

    import dynamic from 'next/dynamic'

    // stop SSR and load the navigation on the client side so that the menu size is calculated by the client window.
    const Header = dynamic(
      () => import('../components/Header/Header'),
      { ssr: false }
    )


## Header.js

* Added a test to set the notice message and increase coverage to 100%