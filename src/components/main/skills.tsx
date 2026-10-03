import { SkillDataProvider } from "@/components/sub/skill-data-provider";
import { SkillText } from "@/components/sub/skill-text";

import {
  BACKEND_SKILL,
  FRONTEND_SKILL,
  FULLSTACK_SKILL,
  OTHER_SKILL,
  SKILL_DATA,
} from "@/constants";

export const Skills = () => {
  return (
    <section
      id="skills"
      className="flex flex-col items-center justify-center gap-6 md:gap-3 h-full relative overflow-hidden py-20 px-4 md:px-10"
    >
      <SkillText />

      <div className="flex flex-row justify-center md:justify-around flex-wrap mt-8 md:mt-4 gap-4 md:gap-5 items-center w-full max-w-7xl">
        {SKILL_DATA.map((skill, i) => (
          <SkillDataProvider
            key={skill.skill_name}
            src={skill.image}
            name={skill.skill_name}
            width={skill.width}
            height={skill.height}
            index={i}
          />
        ))}
      </div>

      <div className="flex flex-row justify-center md:justify-around flex-wrap mt-4 gap-4 md:gap-5 items-center w-full max-w-7xl">
        {FRONTEND_SKILL.map((skill, i) => (
          <SkillDataProvider
            key={skill.skill_name}
            src={skill.image}
            name={skill.skill_name}
            width={skill.width}
            height={skill.height}
            index={i}
          />
        ))}
      </div>
      <div className="flex flex-row justify-center md:justify-around flex-wrap mt-4 gap-4 md:gap-5 items-center w-full max-w-7xl">
        {BACKEND_SKILL.map((skill, i) => (
          <SkillDataProvider
            key={skill.skill_name}
            src={skill.image}
            name={skill.skill_name}
            width={skill.width}
            height={skill.height}
            index={i}
          />
        ))}
      </div>
      <div className="flex flex-row justify-center md:justify-around flex-wrap mt-4 gap-4 md:gap-5 items-center w-full max-w-7xl">
        {FULLSTACK_SKILL.map((skill, i) => (
          <SkillDataProvider
            key={skill.skill_name}
            src={skill.image}
            name={skill.skill_name}
            width={skill.width}
            height={skill.height}
            index={i}
          />
        ))}
      </div>
      <div className="flex flex-row justify-center md:justify-around flex-wrap mt-4 gap-4 md:gap-5 items-center w-full max-w-7xl">
        {OTHER_SKILL.map((skill, i) => (
          <SkillDataProvider
            key={skill.skill_name}
            src={skill.image}
            name={skill.skill_name}
            width={skill.width}
            height={skill.height}
            index={i}
          />
        ))}
      </div>

      <div className="w-full h-full absolute inset-0 z-[-10]">
        <div className="w-full h-full opacity-30 absolute flex items-center justify-center bg-cover">
          <video
            className="w-full h-full object-cover"
            preload="false"
            playsInline
            loop
            muted
            autoPlay
          >
            <source src="/videos/skills-bg.vid" type="video/webm" />
          </video>
        </div>
      </div>
    </section>
  );
};
