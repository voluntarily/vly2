// React Components can be very very terse
export const Greet = () => <p className='greeting' >Hello, *Your name here*!</p>

export const Hello = ({ name, surname }) => <p className='greeting' >Hello, {name} {surname}</p>

export default Greet
