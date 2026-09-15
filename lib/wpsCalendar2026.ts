import type { SchoolEvent } from "./events";

export const WPS_2026_2027_SOURCE_PREFIX = "wps-hs-2026-2027";

export type WpsCalendarSeedEvent = Omit<SchoolEvent, "id"> & {
  key: string;
  description: string;
};

export const WPS_2026_2027_EVENTS: WpsCalendarSeedEvent[] = [
  {
    key: "2026-06-06-sat",
    date: "2026-06-06",
    name: "SAT Testing Day at WPS",
    type: "exam",
    description:
      "WPS is hosting the SAT on campus. Registered students should check their testing details for arrival and room information.",
  },
  {
    key: "2026-06-10-switzerland",
    date: "2026-06-10",
    endDate: "2026-06-18",
    name: "Switzerland Trip",
    type: "event",
    description:
      "Students on the Switzerland trip will be away June 10–18. Trip leaders will share travel details directly with participants.",
  },
  {
    key: "2026-08-01-senior-parking",
    date: "2026-08-01",
    name: "Senior Parking Paint Day",
    type: "event",
    description:
      "Seniors can paint their parking spaces from 6 a.m. to 1 p.m. Follow the preparation details shared by the school.",
  },
  {
    key: "2026-08-05-new-residential-arrivals",
    date: "2026-08-05",
    endDate: "2026-08-07",
    name: "New Residential Students Arrive",
    type: "event",
    description:
      "New residential students arrive and move in August 5–7. Res Life will share individual arrival details with families.",
  },
  {
    key: "2026-08-06-reslife-orientation",
    date: "2026-08-06",
    name: "ResLife New Family Orientation",
    type: "event",
    description:
      "New residential families are invited to orientation at 6:30 p.m. in the Cypress Center.",
  },
  {
    key: "2026-08-07-new-family-breakfast",
    date: "2026-08-07",
    name: "High School New Family Breakfast",
    type: "event",
    description:
      "New high school families are welcome for breakfast at 9:30 a.m. in the Cypress Center.",
  },
  {
    key: "2026-08-09-returning-residential-arrivals",
    date: "2026-08-09",
    endDate: "2026-08-10",
    name: "Returning Residential Students Arrive",
    type: "event",
    description:
      "Returning residential students arrive August 9–10. Res Life will share arrival windows and move-in details directly.",
  },
  {
    key: "2026-08-10-new-student-orientation",
    date: "2026-08-10",
    name: "Create Your Future: New Student and Family Orientation",
    type: "event",
    description:
      "New high school students and their families can meet the community and get ready for the year from 1–3 p.m.",
  },
  {
    key: "2026-08-10-sports-physicals",
    date: "2026-08-10",
    name: "Sports Physicals and ECG/EKG Night",
    type: "event",
    description:
      "Student-athletes can complete sports physicals and ECG/EKG screening from 4:30–7:30 p.m. in the gym. Sign-up is required; use the registration information provided by the school.",
  },
  {
    key: "2026-08-12-first-day-new-students",
    date: "2026-08-12",
    name: "First Day for 9th Grade and New 10th–12th Grade Students",
    type: "event",
    description:
      "Welcome to the new school year. This first day is for all 9th graders and students new to WPS in grades 10–12.",
  },
  {
    key: "2026-08-13-first-day-all-students",
    date: "2026-08-13",
    name: "First Day for All High School Students",
    type: "event",
    description:
      "All high school students return to campus for the first full-community day of the school year.",
  },
  {
    key: "2026-08-13-eight-period",
    date: "2026-08-13",
    name: "8 Period Day",
    type: "event",
    description:
      "All eight class periods meet today. Check the school schedule for period and lunch times.",
  },
  {
    key: "2026-08-14-senior-sunrise",
    date: "2026-08-14",
    name: "Senior Sunrise",
    type: "event",
    description:
      "The Class of 2027 gathers for Senior Sunrise, a tradition that marks the beginning of senior year. Watch for time and location details from the school.",
  },
  {
    key: "2026-08-14-unity-day",
    date: "2026-08-14",
    name: "Unity Day",
    type: "event",
    description:
      "Each grade heads out for a day together: seniors to Aquatica, juniors to Topgolf, sophomores to Andretti Indoor Karting, and freshmen to Kings Bowl.",
  },
  {
    key: "2026-08-20-entrepreneurship",
    date: "2026-08-20",
    name: "Entrepreneurship Event",
    type: "event",
    description:
      "The high school entrepreneurship event begins at 6 p.m. in the Cypress Center.",
  },
  {
    key: "2026-08-22-sat",
    date: "2026-08-22",
    name: "SAT Testing Day at WPS",
    type: "exam",
    description:
      "WPS is hosting the SAT on campus. Registered students should check their testing details for arrival and room information.",
  },
  {
    key: "2026-08-24-cat4",
    date: "2026-08-24",
    endDate: "2026-08-28",
    name: "CAT4 Testing",
    type: "exam",
    description:
      "CAT4 testing takes place during Living the Crest/TOK classes this week. Students should bring their usual class materials and follow teacher directions.",
  },
  {
    key: "2026-08-25-back-to-school-night",
    date: "2026-08-25",
    name: "High School Back to School Night",
    type: "event",
    description:
      "High school families are invited to meet teachers and learn about the year ahead. The evening begins at 6 p.m.",
  },
  {
    key: "2026-08-26-add-drop-deadline",
    date: "2026-08-26",
    name: "Add/Drop Request Deadline",
    type: "deadline",
    description:
      "Course add/drop requests are due by 10 p.m. Submit any needed request before the deadline.",
  },
  {
    key: "2026-09-01-club-day",
    date: "2026-09-01",
    name: "Club Day",
    type: "event",
    description:
      "Students can explore high school clubs and find ways to get involved this year.",
  },
  {
    key: "2026-09-07-labor-day",
    date: "2026-09-07",
    name: "Labor Day — No School",
    type: "no-school",
    description:
      "School is closed for Labor Day. Classes resume on the next scheduled school day.",
  },
  {
    key: "2026-09-11-ib-theatre",
    date: "2026-09-11",
    name: "IB Theatre Collaborative Performance",
    type: "event",
    description:
      "IB Theatre students present their collaborative performance at 4 p.m. in the Cypress Center.",
  },
  {
    key: "2026-09-14-nae-summit",
    date: "2026-09-14",
    name: "NAE Summit — Assembly Day Schedule",
    type: "event",
    description:
      "The high school follows an assembly-day schedule for the NAE Summit. Check the daily schedule for adjusted period times.",
  },
  {
    key: "2026-09-15-trip-interest-meeting",
    date: "2026-09-15",
    name: "Student Trips Parent Interest Meeting",
    type: "event",
    description:
      "Families interested in student trips can learn more and ask questions from 6–7:30 p.m. in the Learning Commons.",
  },
  {
    key: "2026-09-16-ib-evaluation",
    date: "2026-09-16",
    endDate: "2026-09-18",
    name: "IB Diploma Programme Remote Evaluation Visit",
    type: "event",
    description:
      "The IB Diploma Programme remote evaluation visit takes place September 16–18. Students involved will receive any needed instructions from their teachers.",
  },
  {
    key: "2026-09-17-eight-period",
    date: "2026-09-17",
    name: "8 Period Day",
    type: "event",
    description:
      "All eight class periods meet today. Check the school schedule for period and lunch times.",
  },
  {
    key: "2026-09-18-conference-day",
    date: "2026-09-18",
    name: "Conference Day — No School",
    type: "no-school",
    description:
      "There are no high school classes during Conference Day.",
  },
  {
    key: "2026-09-28-picture-day",
    date: "2026-09-28",
    name: "Picture Day",
    type: "event",
    description:
      "High school student pictures will be taken today. Come in formal dress and follow the schedule shared by the school.",
  },
  {
    key: "2026-09-28-formal-dress",
    date: "2026-09-28",
    name: "Formal Dress Day",
    type: "event",
    description:
      "Students should arrive in WPS formal dress for Picture Day.",
  },
  {
    key: "2026-10-01-spelling-bee",
    date: "2026-10-01",
    endDate: "2026-10-03",
    name: "Fine Arts Spelling Bee",
    type: "event",
    description:
      "The Fine Arts Spelling Bee runs October 1–3. Participants will receive round and location details from Fine Arts.",
  },
  {
    key: "2026-10-06-eight-period",
    date: "2026-10-06",
    name: "8 Period Day",
    type: "event",
    description:
      "All eight class periods meet today. Check the school schedule for period and lunch times.",
  },
  {
    key: "2026-10-07-psat-sat",
    date: "2026-10-07",
    name: "PSAT and School Day SAT",
    type: "exam",
    description:
      "Students scheduled for the PSAT or School Day SAT will test this morning. Testing assignments and room details will come from the school.",
  },
  {
    key: "2026-10-07-noon-release",
    date: "2026-10-07",
    name: "Noon Release — Teacher Work Day",
    type: "early-dismissal",
    description:
      "Students are released at noon after testing. Faculty remain for a teacher work day.",
  },
  {
    key: "2026-10-08-teacher-work-day",
    date: "2026-10-08",
    name: "Teacher Work Day — No School",
    type: "no-school",
    description:
      "There are no student classes while faculty complete a teacher work day.",
  },
  {
    key: "2026-10-09-fall-break",
    date: "2026-10-09",
    name: "Fall Break — No School",
    type: "no-school",
    description:
      "High school is closed for Fall Break. Enjoy the long weekend.",
  },
  {
    key: "2026-10-12-fall-break",
    date: "2026-10-12",
    name: "Fall Break — No School",
    type: "no-school",
    description:
      "High school remains closed for Fall Break. Classes resume on the next scheduled school day.",
  },
  {
    key: "2026-10-13-homecoming-week",
    date: "2026-10-13",
    endDate: "2026-10-16",
    name: "Homecoming Spirit Week",
    type: "event",
    description:
      "Homecoming Spirit Week runs Tuesday through Friday, with special activities and adjusted schedules throughout the week.",
  },
  {
    key: "2026-10-13-assembly-schedule",
    date: "2026-10-13",
    name: "Homecoming Week — Assembly Schedule",
    type: "event",
    description:
      "High school follows an assembly schedule today for Homecoming Spirit Week.",
  },
  {
    key: "2026-10-14-regular-wednesday",
    date: "2026-10-14",
    name: "Homecoming Week — Regular Wednesday Schedule",
    type: "event",
    description:
      "Classes follow the regular Wednesday schedule today during Homecoming Spirit Week.",
  },
  {
    key: "2026-10-15-assembly-schedule",
    date: "2026-10-15",
    name: "Homecoming Week — Assembly Schedule",
    type: "event",
    description:
      "High school follows an assembly schedule today for Homecoming Spirit Week.",
  },
  {
    key: "2026-10-16-eight-period",
    date: "2026-10-16",
    name: "Homecoming Week — 8 Period Day",
    type: "event",
    description:
      "All eight class periods meet today as Homecoming Spirit Week wraps up.",
  },
  {
    key: "2026-10-13-hoco-activity",
    date: "2026-10-13",
    name: "Homecoming Activity",
    type: "event",
    description:
      "The Homecoming activity runs from 8:30–10:30 a.m. Follow school directions for the day’s location and activities.",
  },
  {
    key: "2026-10-13-lip-sync-rehearsal",
    date: "2026-10-13",
    name: "Lip Sync Rehearsal",
    type: "event",
    description:
      "Homecoming Lip Sync participants rehearse from 3–4:30 p.m.",
  },
  {
    key: "2026-10-16-homecoming-game",
    date: "2026-10-16",
    name: "Homecoming Football Game and Senior Night",
    type: "event",
    description:
      "The Homecoming football game begins at 6 p.m. Senior Night honors seniors in football, cheer, and golf.",
  },
  {
    key: "2026-10-17-homecoming-dance",
    date: "2026-10-17",
    name: "Homecoming Dance",
    type: "event",
    description:
      "High school students celebrate Homecoming at the annual dance. Watch for ticket, time, and location details from the school.",
  },
  {
    key: "2026-10-23-ib-music",
    date: "2026-10-23",
    name: "IB Music Performance",
    type: "event",
    description:
      "IB Music students perform at 4 p.m. in the Cypress Center.",
  },
  {
    key: "2026-10-27-ib-201",
    date: "2026-10-27",
    name: "IB 201: IBDP and High School Pathways Info Night",
    type: "event",
    description:
      "Students and families can learn about the IB Diploma Programme and high school pathways from 6–8 p.m. in the Cypress Center.",
  },
  {
    key: "2026-10-27-formal-dress",
    date: "2026-10-27",
    name: "Formal Dress Day",
    type: "event",
    description:
      "High school students should arrive in WPS formal dress today.",
  },
  {
    key: "2026-10-30-college-application-deadline",
    date: "2026-10-30",
    name: "College Application Deadline",
    type: "deadline",
    description:
      "College applications due through the school’s fall process should be completed by today. Seniors should confirm individual requirements with College Planning.",
  },
  {
    key: "2026-11-03-day-of-the-dead",
    date: "2026-11-03",
    name: "Day of the Dead",
    type: "event",
    description:
      "The high school community recognizes Día de los Muertos. Details for student activities will be shared at school.",
  },
  {
    key: "2026-11-04-one-act",
    date: "2026-11-04",
    name: "High School One Act",
    type: "event",
    description:
      "High school Fine Arts presents its One Act. Performance details will be shared by Fine Arts.",
  },
  {
    key: "2026-11-04-french-book-fair",
    date: "2026-11-04",
    endDate: "2026-11-18",
    name: "French Book Fair — Online",
    type: "event",
    description:
      "The French Book Fair is open online November 4–18. Access details will be shared with students and families.",
  },
  {
    key: "2026-11-05-florida-theatre-conference",
    date: "2026-11-05",
    endDate: "2026-11-07",
    name: "Florida Theatre Conference",
    type: "event",
    description:
      "Student participants attend the Florida Theatre Conference November 5–7. Fine Arts will provide the trip schedule and travel details.",
  },
  {
    key: "2026-11-06-cas-denmark",
    date: "2026-11-06",
    endDate: "2026-11-13",
    name: "CAS Trip to Copenhagen, Denmark",
    type: "event",
    description:
      "CAS trip participants travel to Copenhagen November 6–13. Trip leaders will share itinerary and travel details directly.",
  },
  {
    key: "2026-11-07-sat",
    date: "2026-11-07",
    name: "SAT Testing Day at WPS",
    type: "exam",
    description:
      "WPS is hosting the SAT on campus. Registered students should check their testing details for arrival and room information.",
  },
  {
    key: "2026-11-10-eight-period",
    date: "2026-11-10",
    name: "8 Period Day",
    type: "event",
    description:
      "All eight class periods meet today. Check the school schedule for period and lunch times.",
  },
  {
    key: "2026-11-10-veterans-processional",
    date: "2026-11-10",
    name: "Veterans Day Processional",
    type: "event",
    description:
      "The WPS Veterans Day Processional begins at 9 a.m. The school will share participation and viewing details.",
  },
  {
    key: "2026-11-11-veterans-day",
    date: "2026-11-11",
    name: "Veterans Day — No School",
    type: "no-school",
    description:
      "There is no school for Veterans Day. This date is reserved as a hurricane make-up day if needed.",
  },
  {
    key: "2026-11-13-thespian-industry-day",
    date: "2026-11-13",
    name: "Thespian Industry Day",
    type: "event",
    description:
      "Fine Arts theatre students take part in Thespian Industry Day. Participants will receive the day’s schedule from Fine Arts.",
  },
  {
    key: "2026-11-14-fdpa-regionals",
    date: "2026-11-14",
    name: "FDPA Regionals",
    type: "event",
    description:
      "WPS dance participants attend the Florida Dance Performance Assessment regional event. Fine Arts will provide call times and travel details.",
  },
  {
    key: "2026-11-17-band-concert",
    date: "2026-11-17",
    name: "Band Concert",
    type: "event",
    description:
      "WPS band students present their concert performance. Fine Arts will share the performance time and venue.",
  },
  {
    key: "2026-11-19-sga-philanthropy",
    date: "2026-11-19",
    name: "SGA Philanthropy Trip",
    type: "event",
    description:
      "SGA students head out for a philanthropy trip. Participants will receive trip details from their advisor.",
  },
  {
    key: "2026-11-18-thespians-district",
    date: "2026-11-18",
    endDate: "2026-11-21",
    name: "Thespians District Festival",
    type: "event",
    description:
      "WPS thespians participate in the district festival November 18–21. Fine Arts will share performance and travel schedules.",
  },
  {
    key: "2026-11-20-world-childrens-day",
    date: "2026-11-20",
    name: "World Children’s Day",
    type: "event",
    description:
      "The high school community recognizes World Children’s Day. School activities will be announced closer to the date.",
  },
  {
    key: "2026-11-23-thanksgiving-break",
    date: "2026-11-23",
    endDate: "2026-11-27",
    name: "Thanksgiving Break — No School",
    type: "no-school",
    description:
      "There are no classes November 23–27 for Thanksgiving Break. Classes resume on the next scheduled school day.",
  },
  {
    key: "2026-11-23-dorms-closed",
    date: "2026-11-23",
    endDate: "2026-11-27",
    name: "Res Life Dorms Closed",
    type: "event",
    description:
      "Residential Life dorms are closed during Thanksgiving Break. Residential families should follow Res Life departure and return instructions.",
  },
  {
    key: "2026-11-23-reslife-trip",
    date: "2026-11-23",
    endDate: "2026-11-27",
    name: "Res Life Thanksgiving Break Trip",
    type: "event",
    description:
      "Res Life offers a sponsored trip during Thanksgiving Break. Eligible residential students will receive sign-up and itinerary details.",
  },
  {
    key: "2026-12-01-formal-dress",
    date: "2026-12-01",
    name: "Formal Dress Day",
    type: "event",
    description:
      "High school students should arrive in WPS formal dress today.",
  },
  {
    key: "2026-12-03-ib-mock-exams",
    date: "2026-12-03",
    endDate: "2026-12-17",
    name: "IB Mock Exams",
    type: "exam",
    description:
      "IB mock exams run December 3–17. Students should follow the exam schedule and preparation guidance from their teachers.",
  },
  {
    key: "2026-12-14-semester-assessments",
    date: "2026-12-14",
    endDate: "2026-12-17",
    name: "Semester 1 Assessments — Early Dismissal",
    type: "exam",
    description:
      "Semester 1 assessments take place December 14–17, with early dismissal each day. Follow the assessment schedule shared by the high school.",
  },
  {
    key: "2026-12-17-noon-release",
    date: "2026-12-17",
    name: "Noon Release",
    type: "early-dismissal",
    description:
      "Students are dismissed at noon after the final day of Semester 1 assessments.",
  },
  {
    key: "2026-12-18-teacher-work-day",
    date: "2026-12-18",
    name: "Teacher Work Day — No School",
    type: "no-school",
    description:
      "There are no student classes while faculty complete a teacher work day.",
  },
  {
    key: "2026-12-18-winter-break",
    date: "2026-12-18",
    endDate: "2027-01-04",
    name: "Winter Break — No School",
    type: "no-school",
    description:
      "School is closed for Winter Break from December 18 through January 4. Classes resume January 6 after the professional development day.",
  },
  {
    key: "2027-01-02-new-residential-arrivals",
    date: "2027-01-02",
    name: "New Residential Life Students Arrive",
    type: "event",
    description:
      "New Residential Life students arrive on campus. Res Life will share individual arrival and move-in details with families.",
  },
  {
    key: "2027-01-03-returning-residential-arrivals",
    date: "2027-01-03",
    name: "Returning Residential Life Students Arrive",
    type: "event",
    description:
      "Returning Residential Life students arrive back on campus. Follow the return instructions and arrival window from Res Life.",
  },
  {
    key: "2027-01-05-professional-development",
    date: "2027-01-05",
    name: "Professional Development Day — No School",
    type: "no-school",
    description:
      "There are no student classes while faculty take part in professional development.",
  },
  {
    key: "2027-01-06-classes-resume",
    date: "2027-01-06",
    name: "Classes Resume",
    type: "event",
    description:
      "Welcome back. High school classes resume after Winter Break.",
  },
  {
    key: "2027-01-12-ib-201-junior-parents",
    date: "2027-01-12",
    name: "IB 201: Diploma Programme Junior Parent Session",
    type: "event",
    description:
      "Parents of juniors pursuing the full IB Diploma are invited to an information session from 6–7:30 p.m. in the Cypress Center.",
  },
  {
    key: "2027-01-14-nyc-dance",
    date: "2027-01-14",
    endDate: "2027-01-17",
    name: "New York City Dance Trip",
    type: "event",
    description:
      "Dance trip participants travel to New York City January 14–17. Fine Arts will provide the itinerary and travel details.",
  },
  {
    key: "2027-01-18-mlk",
    date: "2027-01-18",
    name: "Martin Luther King Jr. Day — No School",
    type: "no-school",
    description:
      "School is closed in observance of Martin Luther King Jr. Day.",
  },
  {
    key: "2027-01-20-day-of-service",
    date: "2027-01-20",
    name: "Day of Service",
    type: "event",
    description:
      "Students take part in a school-wide day centered on service. Project assignments and practical details will be shared by the school.",
  },
  {
    key: "2027-01-26-formal-dress",
    date: "2027-01-26",
    name: "Formal Dress Day",
    type: "event",
    description:
      "High school students should arrive in WPS formal dress today.",
  },
  {
    key: "2027-01-28-eight-period",
    date: "2027-01-28",
    name: "8 Period Day",
    type: "event",
    description:
      "All eight class periods meet today. Check the school schedule for period and lunch times.",
  },
  {
    key: "2027-01-29-conference-day",
    date: "2027-01-29",
    name: "Conference Day — No School for LS/HS",
    type: "no-school",
    description:
      "There are no Lower School or High School classes during Conference Day.",
  },
  {
    key: "2027-02-02-tanzania",
    date: "2027-02-02",
    endDate: "2027-02-12",
    name: "Tanzania Trip",
    type: "event",
    description:
      "Tanzania trip participants travel February 2–12. Trip leaders will share itinerary and travel details directly.",
  },
  {
    key: "2027-02-05-ib-music",
    date: "2027-02-05",
    name: "IB Music Performance",
    type: "event",
    description:
      "IB Music students perform from 3–6 p.m. Performance details will be shared by Fine Arts.",
  },
  {
    key: "2027-02-05-fdoa",
    date: "2027-02-05",
    endDate: "2027-02-07",
    name: "FDOA Overnight Trip",
    type: "event",
    description:
      "Student participants attend the FDOA overnight trip February 5–7. Fine Arts will provide the itinerary and packing details.",
  },
  {
    key: "2027-02-08-grade-9-dc",
    date: "2027-02-08",
    endDate: "2027-02-11",
    name: "Grade 9 Trip to Washington, D.C.",
    type: "event",
    description:
      "Ninth-grade students travel to Washington, D.C., February 8–11. Families will receive itinerary and travel details from the school.",
  },
  {
    key: "2027-02-11-eight-period",
    date: "2027-02-11",
    name: "8 Period Day",
    type: "event",
    description:
      "All eight class periods meet today. Check the school schedule for period and lunch times.",
  },
  {
    key: "2027-02-11-theatre-london",
    date: "2027-02-11",
    endDate: "2027-02-17",
    name: "Theatre Trip to London",
    type: "event",
    description:
      "Theatre trip participants travel to London February 11–17. Fine Arts will provide itinerary and travel details.",
  },
  {
    key: "2027-02-12-presidents-day",
    date: "2027-02-12",
    endDate: "2027-02-15",
    name: "Presidents’ Day Weekend — No School",
    type: "no-school",
    description:
      "There are no classes February 12–15 for Presidents’ Day weekend. Classes resume on the next scheduled school day.",
  },
  {
    key: "2027-02-16-france",
    date: "2027-02-16",
    endDate: "2027-02-24",
    name: "Language Immersion Trip to France",
    type: "event",
    description:
      "Language immersion participants travel to France February 16–24. Trip leaders will share itinerary and travel details directly.",
  },
  {
    key: "2027-02-19-portraits",
    date: "2027-02-19",
    name: "Tom Marshall Portraits",
    type: "event",
    description:
      "Portrait appointments begin at 9:30 a.m. Participation is by sign-up only; use the scheduling information provided by the school.",
  },
  {
    key: "2027-02-19-ib-dance",
    date: "2027-02-19",
    name: "IB Dance Performance",
    type: "event",
    description:
      "IB Dance students perform at 4 p.m. Fine Arts will share venue and audience details.",
  },
  {
    key: "2027-03-02-ib-art-show",
    date: "2027-03-02",
    name: "IB Art Show",
    type: "event",
    description:
      "IB visual arts students share their work in the Cypress Center atrium.",
  },
  {
    key: "2027-03-08-tanzania-presentation",
    date: "2027-03-08",
    name: "Tanzania Presentation — Assembly Schedule",
    type: "event",
    description:
      "The high school follows an assembly schedule for a student presentation about the Tanzania trip.",
  },
  {
    key: "2027-03-08-formal-dress",
    date: "2027-03-08",
    name: "Formal Dress Day",
    type: "event",
    description:
      "High school students should arrive in WPS formal dress today.",
  },
  {
    key: "2027-03-11-multicultural-fest",
    date: "2027-03-11",
    name: "Multicultural Fest",
    type: "event",
    description:
      "The WPS community comes together to share and celebrate cultures represented across our school.",
  },
  {
    key: "2027-03-11-noon-dismissal",
    date: "2027-03-11",
    name: "Noon Dismissal",
    type: "early-dismissal",
    description:
      "High school students are dismissed at noon after Multicultural Fest activities.",
  },
  {
    key: "2027-03-15-spring-break",
    date: "2027-03-15",
    endDate: "2027-03-19",
    name: "Spring Break — No School",
    type: "no-school",
    description:
      "There are no classes March 15–19 for Spring Break. Classes resume on the next scheduled school day.",
  },
  {
    key: "2027-03-15-dorms-closed",
    date: "2027-03-15",
    endDate: "2027-03-19",
    name: "Res Life Dorms Closed",
    type: "event",
    description:
      "Residential Life dorms are closed during Spring Break. Residential families should follow Res Life departure and return instructions.",
  },
  {
    key: "2027-03-15-reslife-trip",
    date: "2027-03-15",
    endDate: "2027-03-19",
    name: "Res Life Spring Break Trip",
    type: "event",
    description:
      "Res Life offers a sponsored trip during Spring Break. Eligible residential students will receive sign-up and itinerary details.",
  },
  {
    key: "2027-04-01-fools-for-flocks",
    date: "2027-04-01",
    name: "Fools for Flocks",
    type: "event",
    description:
      "Fools for Flocks takes place today. School organizers will share participation details closer to the event.",
  },
  {
    key: "2027-04-01-tok-exhibition",
    date: "2027-04-01",
    name: "TOK Exhibition — IB Diploma Juniors",
    type: "event",
    description:
      "IB Diploma juniors present their Theory of Knowledge exhibition at 6 p.m. in the Cypress Center.",
  },
  {
    key: "2027-04-02-tok-students",
    date: "2027-04-02",
    name: "TOK Exhibition for Students",
    type: "event",
    description:
      "Students visit the Theory of Knowledge exhibition during Period 4.",
  },
  {
    key: "2027-04-03-prom",
    date: "2027-04-03",
    name: "Prom",
    type: "event",
    description:
      "High school students celebrate at Prom. Watch for ticket, guest, time, and venue details from the school.",
  },
  {
    key: "2027-04-14-myp-exhibition",
    date: "2027-04-14",
    endDate: "2027-04-15",
    name: "MYP Personal Project Exhibition",
    type: "event",
    description:
      "MYP students present their Personal Projects in the gym April 14–15.",
  },
  {
    key: "2027-04-16-hs-in-session",
    date: "2027-04-16",
    name: "High School in Session",
    type: "event",
    description:
      "High school classes meet on their regular schedule while Lower and Middle School hold conferences.",
  },
  {
    key: "2027-04-16-ls-ms-conferences",
    date: "2027-04-16",
    name: "Lower and Middle School Conferences",
    type: "event",
    description:
      "Lower and Middle School conferences take place today. High school remains in session.",
  },
  {
    key: "2027-04-19-hurricane-makeup",
    date: "2027-04-19",
    name: "No School — Hurricane Make-Up Day",
    type: "no-school",
    description:
      "There are no classes unless the school announces that this hurricane make-up day is needed.",
  },
  {
    key: "2027-04-22-earth-day",
    date: "2027-04-22",
    name: "Earth Day",
    type: "event",
    description:
      "The WPS community recognizes Earth Day. School activities will be shared closer to the date.",
  },
  {
    key: "2027-04-22-senior-last-day",
    date: "2027-04-22",
    name: "Senior Last Day",
    type: "event",
    description:
      "This is the Class of 2027’s final regular day of high school classes.",
  },
  {
    key: "2027-04-22-senior-sunset",
    date: "2027-04-22",
    name: "Senior Sunset",
    type: "event",
    description:
      "Seniors gather for Senior Sunset to mark the close of their final year. Time and location details will come from the school.",
  },
  {
    key: "2027-04-23-formal-dress",
    date: "2027-04-23",
    name: "Formal Dress Day",
    type: "event",
    description:
      "High school students should arrive in WPS formal dress today.",
  },
  {
    key: "2027-04-23-leaving-a-legacy",
    date: "2027-04-23",
    name: "Leaving a Legacy",
    type: "event",
    description:
      "Seniors take part in the Leaving a Legacy tradition. The school will share the day’s schedule with the Class of 2027.",
  },
  {
    key: "2027-04-23-senior-breakfast",
    date: "2027-04-23",
    name: "Senior Breakfast",
    type: "event",
    description:
      "The Class of 2027 gathers for Senior Breakfast before the senior walk-out.",
  },
  {
    key: "2027-04-23-senior-walkout",
    date: "2027-04-23",
    name: "Senior Walk-Out",
    type: "event",
    description:
      "The school community celebrates the Class of 2027 during the traditional senior walk-out.",
  },
  {
    key: "2027-04-23-grad-bash",
    date: "2027-04-23",
    name: "Grad Bash",
    type: "event",
    description:
      "Eligible seniors head to Grad Bash. Sign-up, departure, and return details will be shared with the Class of 2027.",
  },
  {
    key: "2027-04-26-sga-elections",
    date: "2027-04-26",
    name: "SGA Elections — Assembly Schedule",
    type: "event",
    description:
      "The high school follows an assembly schedule for Student Government Association elections.",
  },
  {
    key: "2027-04-27-ib-exams",
    date: "2027-04-27",
    endDate: "2027-05-18",
    name: "IB Exams",
    type: "exam",
    description:
      "IB exams run April 27–May 18. Students should follow their official exam schedule and all testing instructions.",
  },
  {
    key: "2027-04-27-class-2028-parent-night",
    date: "2027-04-27",
    name: "Class of 2028 Senior Parent Night",
    type: "event",
    description:
      "Parents of the Class of 2028 are invited to begin planning for senior year at 6:30 p.m. in the Cypress Center.",
  },
  {
    key: "2027-05-20-eight-period",
    date: "2027-05-20",
    name: "8 Period Day",
    type: "event",
    description:
      "All eight class periods meet today. Check the school schedule for period and lunch times.",
  },
  {
    key: "2027-05-21-semester-assessments",
    date: "2027-05-21",
    endDate: "2027-05-26",
    name: "Semester 2 Assessments — Early Dismissal",
    type: "exam",
    description:
      "Semester 2 assessments run May 21–26, with early dismissal each day. Follow the assessment schedule shared by the high school.",
  },
  {
    key: "2027-05-26-last-day",
    date: "2027-05-26",
    name: "Last Day of School",
    type: "event",
    description:
      "This is the final day of classes for the 2026–2027 school year. Have a safe and restful summer.",
  },
  {
    key: "2027-05-26-noon-dismissal",
    date: "2027-05-26",
    name: "Noon Dismissal",
    type: "early-dismissal",
    description:
      "Students are dismissed at noon on the last day of school.",
  },
  {
    key: "2027-05-30-graduation",
    date: "2027-05-30",
    name: "Graduation — Class of 2027",
    type: "event",
    description:
      "WPS celebrates the Class of 2027 at graduation. Ceremony time and guest details will be shared by the school.",
  },
  {
    key: "2027-06-05-sat",
    date: "2027-06-05",
    name: "SAT Testing Day at WPS",
    type: "exam",
    description:
      "WPS is hosting the SAT on campus. Registered students should check their testing details for arrival and room information.",
  },
  {
    key: "2027-06-13-switzerland",
    date: "2027-06-13",
    endDate: "2027-06-20",
    name: "NAE Expedition: Switzerland",
    type: "event",
    description:
      "Students on the NAE Switzerland expedition travel June 13–20. Expedition leaders will share itinerary and travel details directly.",
  },
];
