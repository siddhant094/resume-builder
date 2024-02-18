import { saveAs } from 'file-saver';
// import { experiences, education, skills, achievements } from './cv-data';
import { DocumentCreator } from './cv-generator';
import { Packer } from 'docx';
import { StyledButton } from '../atoms';
import { useCallback } from 'react';
import DEFAULT_RESUME_JSON from 'src/helpers/constants/resume-data.json';

import {
  useDatabases,
  useFrameworks,
  useLanguages,
  useLibraries,
  usePractices,
  useTechnologies,
  useTools,
} from 'src/stores/skills';
import { useActivity } from 'src/stores/activity';
import { useAwards } from 'src/stores/awards';
import { useBasicDetails } from 'src/stores/basic';
import { useEducations } from 'src/stores/education';
import { useExperiences } from 'src/stores/experience';
import { useVoluteeringStore } from 'src/stores/volunteering';

export const DocResume = () => {
  //   const exportResumeData = useCallback(() => {
  //     const updatedResume = {
  //       work: useExperiences.getState().experiences,
  //       education: useEducations.getState().academics,
  //       awards: useAwards.getState().awards,
  //       volunteer: useVoluteeringStore.getState().volunteeredExps,
  //       skills: {
  //         languages: useLanguages.getState().get(),
  //         frameworks: useFrameworks.getState().get(),
  //         technologies: useTechnologies.getState().get(),
  //         libraries: useLibraries.getState().get(),
  //         databases: useDatabases.getState().get(),
  //         practices: usePractices.getState().get(),
  //         tools: useTools.getState().get(),
  //       },
  //       activities: useActivity.getState().activities,
  //     };
  //   }, []);

  const generateDocx = () => {
    const updatedResume: any = {
      basics: {
        ...DEFAULT_RESUME_JSON.basics,
        ...useBasicDetails.getState().values,
      },
      work: useExperiences.getState().experiences,
      education: useEducations.getState().academics,
      awards: useAwards.getState().awards,
      volunteer: useVoluteeringStore.getState().volunteeredExps,
      skills: {
        languages: useLanguages.getState().get(),
        frameworks: useFrameworks.getState().get(),
        technologies: useTechnologies.getState().get(),
        libraries: useLibraries.getState().get(),
        databases: useDatabases.getState().get(),
        practices: usePractices.getState().get(),
        tools: useTools.getState().get(),
      },
      activities: useActivity.getState().activities,
    };

    const documentCreator = new DocumentCreator();
    const doc = documentCreator.create(updatedResume);

    Packer.toBlob(doc).then((blob) => {
      console.log(blob);
      saveAs(blob, 'Resume.docx');
      console.log('Document created successfully');
    });
  };

  return (
    <StyledButton onClick={generateDocx} variant="outlined">
      Download as DOCX
    </StyledButton>
  );
};
