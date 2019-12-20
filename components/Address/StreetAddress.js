/**
   * Creates a link to google maps for the supplied address.
   * @param {string} address
   */
const googleMapsAddressUrl = (address) => {
  address = address.trim().replace(/\n/g, ' ')
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
}

export const StreetAddressLinkLi = ({ address }) =>
  <a
    href={googleMapsAddressUrl(address)}
    target='_blank'
    rel='noopener noreferrer'
  >
    {address}
  </a>
