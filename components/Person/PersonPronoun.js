// converts a person pronoun to a  string
const PersonPronouns = ({ message, pronoun }) =>

  pronoun ? (
    <div>
      <span>{message}</span>
      <style jsx>{`
        span {      
          padding-right: 2em;
          }
      `}</style>
      <span>{pronoun.subject}/ {pronoun.object}/ {pronoun.possessive}</span>
    </div>)
    : <div />

export default PersonPronouns
