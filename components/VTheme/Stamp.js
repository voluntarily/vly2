import styled from 'styled-components'

export const VOverlay = styled.div`
  position: absolute;
  width: 100%; /* Full width (cover the whole parent) */
  height: 100%; /* Full height (cover the whole parent) */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  // background-color: rgba(0,10,0,0.2); /* Black background with opacity */
  z-index: 4; /* Specify a stack order in case you're using a different order for other elements */
  cursor: pointer; /* Add a pointer on hover */

  span {
    position: absolute;
    top: 40%;
    font-size: 80px;
    font-weight: 800;
    color: rgba(0,0,0,0.4);
    transform: rotate(-45deg)
  }

`

// Draw a tilted text stamp over an area
export const Stamp = ({ children }) =>
  <VOverlay><span>{children}</span></VOverlay>
