'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, School, GraduationCap, Building, CheckCircle } from 'lucide-react';

export default function HelpPage() {
  return (
    <div className="container px-4 py-3 sm:py-4 max-w-4xl mx-auto pb-20 md:pb-8">
      {/* Header */}
      <div className="mb-4 sm:mb-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <HelpCircle className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
          Help & FAQ
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Understanding South African school terms and classifications
        </p>
      </div>

      {/* Quick Reference Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <School className="h-5 w-5" />
              School Sectors
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <strong>Public Schools:</strong> Government-funded institutions managed by the Department of Education
            </div>
            <div>
              <strong>Independent Schools:</strong> Privately owned and managed schools
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              School Phases
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <strong>Primary School:</strong> Grades R (Reception) to Grade 7
            </div>
            <div>
              <strong>Secondary School:</strong> Grades 8 to 12
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Accordion */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="quintiles">
              <AccordionTrigger className="text-left">
                What are School Quintiles (Q1-Q5)?
              </AccordionTrigger>
              <AccordionContent className="space-y-3 text-sm">
                <p>
                  Quintiles are a poverty ranking system used to classify schools based on the socio-economic
                  conditions of the communities they serve. This system helps distribute resources equitably.
                </p>
                <div className="space-y-2 pl-4">
                  <div>
                    <strong className="text-red-600">Q1 (Quintile 1) - Poorest Schools</strong>
                    <p className="text-muted-foreground">Serve the poorest communities. Receive the most government funding per learner. No-fee schools.</p>
                  </div>
                  <div>
                    <strong className="text-orange-600">Q2 (Quintile 2) - Very Poor Schools</strong>
                    <p className="text-muted-foreground">Serve very poor communities. High government funding. Usually no-fee schools.</p>
                  </div>
                  <div>
                    <strong className="text-yellow-600">Q3 (Quintile 3) - Poor Schools</strong>
                    <p className="text-muted-foreground">Serve poor communities. Moderate government funding. Often no-fee schools.</p>
                  </div>
                  <div>
                    <strong className="text-blue-600">Q4 (Quintile 4) - Less Poor Schools</strong>
                    <p className="text-muted-foreground">Serve less poor communities. Lower government funding. May charge fees.</p>
                  </div>
                  <div>
                    <strong className="text-green-600">Q5 (Quintile 5) - Least Poor Schools</strong>
                    <p className="text-muted-foreground">Serve wealthiest communities. Lowest government funding. Typically fee-charging schools.</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="no-fee">
              <AccordionTrigger className="text-left">
                What are No-Fee Schools?
              </AccordionTrigger>
              <AccordionContent className="text-sm">
                <p className="mb-2">
                  No-fee schools are public schools where parents are not required to pay school fees.
                  Most schools in quintiles 1-3 are designated as no-fee schools.
                </p>
                <p>
                  The government compensates for the lack of fee income by providing additional funding
                  to ensure these schools can operate effectively.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="verified">
              <AccordionTrigger className="text-left">
                What does "Verified" mean?
              </AccordionTrigger>
              <AccordionContent className="text-sm">
                <p>
                  A verified school indicates that the school's information has been officially confirmed
                  and validated. Verified schools display a green checkmark badge. This helps users identify
                  schools with accurate, up-to-date information.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="natemis">
              <AccordionTrigger className="text-left">
                What is NatEMIS?
              </AccordionTrigger>
              <AccordionContent className="text-sm">
                <p>
                  NatEMIS (National Education Management Information System) is the unique identification
                  number assigned to each school in South Africa. It's used for official record-keeping
                  and tracking of schools across the country.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="learner-educator-ratio">
              <AccordionTrigger className="text-left">
                What is the Learner-to-Educator Ratio?
              </AccordionTrigger>
              <AccordionContent className="text-sm">
                <p className="mb-2">
                  The learner-to-educator ratio indicates how many learners there are per educator at a school.
                  For example, a ratio of 30:1 means there are 30 learners for every 1 educator.
                </p>
                <p>
                  Lower ratios generally indicate smaller class sizes and potentially more individual attention
                  for learners. The national average varies, but typically ranges from 25:1 to 35:1.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="exam-centre">
              <AccordionTrigger className="text-left">
                What is an Exam Centre?
              </AccordionTrigger>
              <AccordionContent className="text-sm">
                <p>
                  An exam centre is a school designated by the Department of Education to administer
                  official examinations. These schools are equipped and authorized to conduct national
                  assessments and matriculation exams.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="public-vs-independent">
              <AccordionTrigger className="text-left">
                What's the difference between Public and Independent schools?
              </AccordionTrigger>
              <AccordionContent className="text-sm">
                <div className="space-y-3">
                  <div>
                    <strong>Public Schools:</strong>
                    <ul className="list-disc pl-5 mt-1 text-muted-foreground">
                      <li>Funded by the government</li>
                      <li>Follow national curriculum</li>
                      <li>Governed by School Governing Bodies (SGBs)</li>
                      <li>May be fee-paying or no-fee depending on quintile</li>
                    </ul>
                  </div>
                  <div>
                    <strong>Independent Schools:</strong>
                    <ul className="list-disc pl-5 mt-1 text-muted-foreground">
                      <li>Privately owned and funded</li>
                      <li>Can choose their own curriculum (within regulations)</li>
                      <li>Charge school fees</li>
                      <li>May offer alternative education approaches</li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="how-to-use">
              <AccordionTrigger className="text-left">
                How do I use this website?
              </AccordionTrigger>
              <AccordionContent className="text-sm">
                <div className="space-y-3">
                  <div>
                    <strong>Browse Page:</strong>
                    <p className="text-muted-foreground">View all schools in a grid. Use filters to narrow down by sector, phase, quintile, or verification status. Click any school card to view detailed information.</p>
                  </div>
                  <div>
                    <strong>Find Page:</strong>
                    <p className="text-muted-foreground">Use the interactive map to explore schools by location. Click markers to see school info, or use the search bar to find specific schools.</p>
                  </div>
                  <div>
                    <strong>Analytics Page:</strong>
                    <p className="text-muted-foreground">View statistics and visual representations of school data including distributions by sector, phase, and quintile.</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Additional Help */}
      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>Still have questions?</p>
            <p className="mt-2">
              This data is based on the South African Department of Basic Education's school information system.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
