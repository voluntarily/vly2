import Icon from '@ant-design/icons'

const shieldPathBody = `
M45,0.06 
L3.00976185,0.0700000284 C1.35314575,0.07 0.01,1.41314575 0.01,3.07 
L-0.0159985644,18.4123055 C0.0216720585,32.6777292 9.96767687,44.995639 23.9007382,48.0369951 
L24.336087,48.0350268 C38.0226065,44.9175759 47.7649566,32.8482196 47.9809834,18.8711627 
L47.9999994,3.0610568 C47.9999994,1.40314575 46.6568542,0.06 45,0.06 
Z 
`

const shieldPathEdge = `
M45,0.06 
L3.00976185,0.0700000284 C1.35314575,0.07 0.01,1.41314575 0.01,3.07 
L-0.0159985644,18.4123055 C0.0216720585,32.6777292 9.96767687,44.995639 23.9007382,48.0369951 
L24.336087,48.0350268 C38.0226065,44.9175759 47.7649566,32.8482196 47.9809834,18.8711627 
L47.9999994,3.0610568 C47.9999994,1.40314575 46.6568542,0.06 45,0.06 
Z 
M3.01,2.07 L45.0002382,2.05999997 C45.5522847,2.05999997 46,2.50771525 46,3.05999997 
L45.9839965,18.1989432 L45.9808762,18.8532061 C45.7733007,31.6916206 36.972058,42.7981623 24.527788,45.932501 
L24.108,46.032 L24.3272618,46.0830049 C11.3108493,43.241738 2.01918689,31.734217 1.98399651,18.4113587 
L2.00999856,3.07169447 C2.01,2.51771525 2.45771525,2.07 3.01,2.07 
Z
`

export const ShieldSvg = ({ score }) => (
  <svg width='100%' height='100%' viewBox='0 0 48 48' version='1.1'>
    <title>shield</title>
    <g id='shield' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd' cursor='pointer'>
      <g id='Group' fillRule='nonzero'>
        <path
          fill='green'
          fillOpacity='0.2'
          d={shieldPathBody} id='shieldBody'
        />
        <path
          fill='green'
          fillOpacity='1'
          d={shieldPathEdge} id='shieldEdge'
        />
        <text x='50%' y='50%' fill='#040' fontSize='32' dominantBaseline='middle' textAnchor='middle'>{score}</text>
      </g>
    </g>
  </svg>
)

export const ShieldIcon = props => <Icon component={ShieldSvg} {...props} />
