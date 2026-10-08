import { qualifications, skills } from '../data/skills'

function SkillsSection() {
  return (
    <div className="skills-content">
      <section className="skills-group" aria-labelledby="skill-list-title">
        <div className="skills-group__heading">
          <span id="skill-list-title">SKILLS</span>
          <span>{String(skills.length).padStart(2, '0')} ITEMS</span>
        </div>
        <div className="skill-list">
          {skills.map((skill, index) => (
            <article className="skill-row" key={skill.name} tabIndex={0}>
              <span className="skill-row__index">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3>{skill.name}</h3>
                <span className="skill-row__category">{skill.category}</span>
                <p>{skill.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="skills-group" aria-labelledby="qualification-list-title">
        <div className="skills-group__heading">
          <span id="qualification-list-title">QUALIFICATIONS</span>
          <span>{String(qualifications.length).padStart(2, '0')} ITEMS</span>
        </div>
        {qualifications.length > 0 ? (
          qualifications.map((qualification) => (
            <article className="skill-row qualification-row" key={`${qualification.name}-${qualification.issuer ?? ''}`}>
              <span className="skill-row__index">Q</span>
              <div>
                <h3>{qualification.name}</h3>
                <p>{[qualification.issuer, qualification.date, qualification.detail].filter(Boolean).join(' | ')}</p>
              </div>
            </article>
          ))
        ) : (
          <p className="qualification-empty">No formal qualifications are listed on the public profile.</p>
        )}
      </section>
    </div>
  )
}

export default SkillsSection