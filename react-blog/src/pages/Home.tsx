import Icon from "../components/ProfileIcon";
import type { IconName } from "../components/ProfileIcon";
import type { ProfileEntry } from "../data/profile";
import {
  awards,
  certifications,
  community,
  education,
  experience,
  profile,
  projects,
  research,
} from "../data/profile";

function ResumeSection({
  id,
  title,
  icon,
  entries,
}: {
  id: string;
  title: string;
  icon: IconName;
  entries: ProfileEntry[];
}) {
  return (
    <section
      className="profile-section"
      id={id}
      aria-labelledby={id + "-title"}
    >
      <h2 id={id + "-title"}>
        <Icon name={icon} />
        {title}
      </h2>
      <div className="profile-entries">
        {entries.map((entry) => (
          <article
            className="profile-entry"
            key={entry.organization + entry.title}
          >
            <p className="profile-period">{entry.period}</p>
            <div className="profile-entry-content">
              <div className="profile-entry-heading">
                <span className="profile-org-mark" aria-hidden="true">
                  <img src={entry.logo} alt="" width="24" height="24" />
                </span>
                <h3>{entry.organization}</h3>
              </div>
              <p className="profile-role">{entry.title}</p>
              {entry.detail && <p className="profile-detail">{entry.detail}</p>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Home() {
  return (
    <main id="profile-main">
      <p className="profile-description">{profile.introduction}</p>
      <ResumeSection
        id="experience"
        title="Work Experience"
        icon="work"
        entries={experience}
      />
      <ResumeSection
        id="community"
        title="Community Experience"
        icon="community"
        entries={community}
      />
      <ResumeSection
        id="education"
        title="Education"
        icon="education"
        entries={education}
      />
      <section
        className="profile-section"
        id="projects"
        aria-labelledby="projects-title"
      >
        <h2 id="projects-title">
          <Icon name="github" />
          Projects
        </h2>
        <div className="profile-projects">
          {projects.map((project) => (
            <article className="profile-project" key={project.name}>
              <p className="profile-project-context">{project.context}</p>
              <div>
                <h3>{project.name}</h3>
                <p className="profile-project-description">
                  {project.description}
                </p>
                <div className="profile-project-links">
                  {project.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.name} ${link.label}`}
                    >
                      <Icon name="github" />
                      {link.label}
                      <Icon name="arrow" />
                    </a>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section
        className="profile-section"
        id="research"
        aria-labelledby="research-title"
      >
        <h2 id="research-title">
          <Icon name="research" />
          Research & Publications
        </h2>
        <article className="profile-research">
          <span className="profile-research-label">
            BLOCKCHAIN · FEDERATED LEARNING · ZERO TRUST
          </span>
          <h3>{research.title}</h3>
          <p className="profile-research-authors">
            <em>{research.authors}</em>
          </p>
          <p>{research.venues}</p>
        </article>
      </section>
      <section
        className="profile-section"
        id="certifications"
        aria-labelledby="certifications-title"
      >
        <h2 id="certifications-title">
          <Icon name="certificate" />
          Certifications
        </h2>
        <div className="profile-certifications">
          {certifications.map((certification) => (
            <article
              className="profile-certification"
              key={certification.title}
            >
              <img
                className="profile-certification-logo"
                src="/images/organizations/aws-wordmark.svg"
                alt=""
                width="38"
                height="38"
              />
              <div>
                <h3>{certification.title}</h3>
                <p>{certification.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section
        className="profile-section"
        id="awards"
        aria-labelledby="awards-title"
      >
        <h2 id="awards-title">
          <Icon name="award" />
          Awards &amp; Honors
        </h2>
        <div className="profile-projects">
          {awards.map((award) => (
            <article
              className="profile-project profile-honor"
              key={award.title}
            >
              <p className="profile-project-context">{award.recognition}</p>
              <div>
                <h3 className="profile-honor-title">
                  {award.href ? (
                    <a
                      href={award.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {award.title} <Icon name="arrow" />
                    </a>
                  ) : (
                    award.title
                  )}
                </h3>
                {award.description && (
                  <p className="profile-project-description">
                    {award.description}
                    {award.repoHref && (
                      <a
                        className="profile-honor-github"
                        href={award.repoHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${award.description} repository on GitHub`}
                      >
                        <Icon name="github" />
                        <span>Repo</span>
                        <Icon name="arrow" />
                      </a>
                    )}
                  </p>
                )}
                {award.members && (
                  <p className="profile-project-description">
                    Team:{" "}
                    {award.members.map((member, index) => (
                      <span key={member.name}>
                        {index > 0 && ", "}
                        <a
                          href={member.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {member.name}
                        </a>
                      </span>
                    ))}
                  </p>
                )}
                {award.details?.map((detail) => (
                  <p className="profile-project-description" key={detail}>
                    {detail}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;
