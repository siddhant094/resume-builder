import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TabStopPosition,
  TabStopType,
  TextRun,
} from 'docx';

function removeTagsFromString(htmlString: string) {
  htmlString = htmlString.replace(/<strong\b[^>]*>(.*?)<\/strong>/gi, '$1');
  htmlString = htmlString.replace(/<ul\b[^>]*>(.*?)<\/ul>/gi, '$1');
  htmlString = htmlString.replace(/^<li>/, '');
  htmlString = htmlString.replace(/<\/li>$/, '');
  let dataArray = htmlString.split('</li><li>');
  return dataArray;
}

export class DocumentCreator {
  public create(data: any): Document {
    console.log(data);
    const document = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 500,
                right: 500,
                bottom: 500,
                left: 500,
              },
            },
          },
          children: [
            new Paragraph({
              text: `${data.basics.name}`,
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              text: `${data.basics.label}`,
              alignment: AlignmentType.CENTER,
            }),
            this.createContactInfo(data.basics.phone, data.basics.url, data.basics.email),
            new Paragraph({
              text: `${data.basics.summary}`,
            }),
            // OBJECTIVE
            this.createHeading('Objective'),
            new Paragraph({
              text: `${data.basics.objective}`,
            }),

            // EDUCATION
            this.createHeading('Education'),
            ...data.education
              .map((education: any) => {
                const arr: Paragraph[] = [];
                arr.push(
                  this.createInstitutionHeader(
                    education.institution,
                    `${education.startDate} - ${education.endDate}`
                  )
                );
                arr.push(this.createRoleText(`${education.studyType} - ${education.area}`));
                // const bulletPoints = this.splitParagraphIntoBullets(education.notes);
                // bulletPoints.forEach((bulletPoint) => {
                //   arr.push(this.createBullet(bulletPoint));
                // });
                return arr;
              })
              .reduce((prev: any, curr: any) => prev.concat(curr), []),
            // EXPERIENCE
            this.createHeading('Experience'),
            ...data.work
              .map((position: any) => {
                const arr: Paragraph[] = [];
                arr.push(
                  this.createInstitutionHeader(
                    position.name,
                    this.createPositionDateText(
                      position.startDate,
                      position.endDate,
                      position.isWorkingHere
                    )
                  )
                );
                arr.push(this.createRoleText(`${position.position}`));

                let sortedtext = removeTagsFromString(position.summary);
                sortedtext.forEach((bulletPoint) => {
                  arr.push(this.createBullet(bulletPoint));
                });

                return arr;
              })
              .reduce((prev: any, curr: any) => prev.concat(curr), []),
            // VOLUNTEERING
            this.createHeading('Volunteering'),
            ...data.volunteer
              .map((role: any) => {
                const arr: Paragraph[] = [];
                arr.push(
                  this.createInstitutionHeader(
                    role.organization,
                    this.createPositionDateText(role.startDate, role.endDate, false)
                  )
                );
                arr.push(this.createRoleText(`${role.position}`));
                arr.push(new Paragraph(`${role.summary}`));
                return arr;
              })
              .reduce((prev: any, curr: any) => prev.concat(curr), []),
            // AWARDS
            this.createHeading('Awards'),
            ...data.awards
              .map((position: any) => {
                const arr: Paragraph[] = [];

                arr.push(this.createInstitutionHeader(position.title, position.date));
                arr.push(this.createRoleText(position.awarder));
                arr.push(new Paragraph(position.summary));
                return arr;
              })
              .reduce((prev: any, curr: any) => prev.concat(curr), []),
            // skills
            this.createHeading('Skills'),
            // ...data.skills.practices
            // .map((practice: any) => {
            // const arr: Paragraph[] = [];
            new Paragraph({
              text: 'Databases: ',
              bullet: {
                level: 0,
              },
              children: [
                new TextRun(data.skills.databases.map((skill: any) => skill.name).join(', ') + '.'),
              ],
            }),
            new Paragraph({
              text: 'Frameworks: ',
              bullet: {
                level: 0,
              },
              children: [
                new TextRun(
                  data.skills.frameworks.map((skill: any) => skill.name).join(', ') + '.'
                ),
              ],
            }),
            new Paragraph({
              text: 'Languages: ',
              bullet: {
                level: 0,
              },
              children: [
                new TextRun(data.skills.languages.map((skill: any) => skill.name).join(', ') + '.'),
              ],
            }),
            new Paragraph({
              text: 'Libraries: ',
              bullet: {
                level: 0,
              },
              children: [
                new TextRun(data.skills.libraries.map((skill: any) => skill.name).join(', ') + '.'),
              ],
            }),
            new Paragraph({
              text: 'Practices: ',
              bullet: {
                level: 0,
              },
              children: [
                new TextRun(data.skills.practices.map((skill: any) => skill.name).join(', ') + '.'),
              ],
            }),
            new Paragraph({
              text: 'Technologies: ',
              bullet: {
                level: 0,
              },
              children: [
                new TextRun(
                  data.skills.technologies.map((skill: any) => skill.name).join(', ') + '.'
                ),
              ],
            }),
            new Paragraph({
              text: 'Tools: ',
              bullet: {
                level: 0,
              },
              children: [
                new TextRun(data.skills.tools.map((skill: any) => skill.name).join(', ') + '.'),
              ],
            }),
            // new Paragraph({}),
            // arr.push(this.createInstitutionHeader('Practice', ''));
            // arr.push(practice.name);
            // return arr;
            // })
            // .reduce((prev: any, curr: any) => prev.concat(curr), []),
            // this.createHeading('Skills, Achievements and Interests'),
            // this.createSubHeading('Skills'),
            // this.createSkillList(skills),
            // this.createSubHeading('Achievements'),
            // ...this.createAchivementsList(achivements),
            // this.createSubHeading('Interests'),
            // this.createInterests(
            //   'Programming, Technology, Music Production, Web Design, 3D Modelling, Dancing.'
            // ),
            // this.createHeading('References'),
            // new Paragraph(
            //   'Dr. Dean Mohamedally Director of Postgraduate Studies Department of Computer Science, University College London Malet Place, Bloomsbury, London WC1E d.mohamedally@ucl.ac.uk'
            // ),
            // new Paragraph('More references upon request'),
            // new Paragraph({
            //   text: 'This CV was generated in real-time based on my Linked-In profile from my personal website www.dolan.bio.',
            //   alignment: AlignmentType.CENTER,
            // }),
          ],
        },
      ],
    });

    return document;
  }

  public createContactInfo(phoneNumber: string, profileUrl: string, email: string): Paragraph {
    return new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun(`Mobile: ${phoneNumber} | LinkedIn: ${profileUrl} | Email: ${email}`)],
    });
  }

  public createHeading(text: string): Paragraph {
    return new Paragraph({
      text: text,
      heading: HeadingLevel.HEADING_1,
      thematicBreak: true,
    });
  }

  public createSubHeading(text: string): Paragraph {
    return new Paragraph({
      text: text,
      heading: HeadingLevel.HEADING_2,
    });
  }

  public createInstitutionHeader(institutionName: string, dateText: string): Paragraph {
    return new Paragraph({
      tabStops: [
        {
          type: TabStopType.RIGHT,
          position: TabStopPosition.MAX,
        },
      ],
      children: [
        new TextRun({
          text: institutionName,
          bold: true,
        }),
        new TextRun({
          text: `\t${dateText}`,
          bold: true,
        }),
      ],
    });
  }

  public createRoleText(roleText: string): Paragraph {
    return new Paragraph({
      children: [
        new TextRun({
          text: roleText,
          italics: true,
        }),
      ],
    });
  }

  public createBullet(text: string): Paragraph {
    return new Paragraph({
      text: text,
      bullet: {
        level: 0,
      },
    });
  }

  // tslint:disable-next-line:no-any
  public createSkillList(skills: any[]): Paragraph {
    return new Paragraph({
      children: [new TextRun(skills.map((skill) => skill.name).join(', ') + '.')],
    });
  }

  // tslint:disable-next-line:no-any
  public createAchivementsList(achivements: any[]): Paragraph[] {
    return achivements.map(
      (achievement) =>
        new Paragraph({
          text: achievement.name,
          bullet: {
            level: 0,
          },
        })
    );
  }

  public createInterests(interests: string): Paragraph {
    return new Paragraph({
      children: [new TextRun(interests)],
    });
  }

  public splitParagraphIntoBullets(text: string): string[] {
    return text.split('\n\n');
  }

  public createPositionDateText(startDate: any, endDate: any, isCurrent: boolean): string {
    const endDateText = isCurrent ? 'Present' : endDate;

    return `${startDate} - ${endDateText}`;
  }

  public getMonthFromInt(value: number): string {
    switch (value) {
      case 1:
        return 'Jan';
      case 2:
        return 'Feb';
      case 3:
        return 'Mar';
      case 4:
        return 'Apr';
      case 5:
        return 'May';
      case 6:
        return 'Jun';
      case 7:
        return 'Jul';
      case 8:
        return 'Aug';
      case 9:
        return 'Sept';
      case 10:
        return 'Oct';
      case 11:
        return 'Nov';
      case 12:
        return 'Dec';
      default:
        return 'N/A';
    }
  }
}
