// converts a person pronoun to a  string
const PersonPronouns = ({ pronoun }) =>
  pronoun
    ? (
      <span>{pronoun.subject}/{pronoun.object}/{pronoun.possessive}</span>
      )
    : null

export default PersonPronouns
