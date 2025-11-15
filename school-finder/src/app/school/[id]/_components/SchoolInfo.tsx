'use client';

import { SchoolDisplay } from '@/types/school';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Mail, Users, GraduationCap, Calendar, Building } from 'lucide-react';

interface SchoolInfoProps {
  school: SchoolDisplay;
}

export function SchoolInfo({ school }: SchoolInfoProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {school.address && (
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Physical Address</p>
                <p className="text-sm text-muted-foreground break-words">{school.address}</p>
              </div>
            </div>
          )}

          {school.postalAddress && (
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Postal Address</p>
                <p className="text-sm text-muted-foreground break-words">{school.postalAddress}</p>
              </div>
            </div>
          )}

          {school.telephone && (
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Telephone</p>
                <a href={`tel:${school.telephone}`} className="text-sm text-primary hover:underline">
                  {school.telephone}
                </a>
              </div>
            </div>
          )}

          {school.municipality && (
            <div className="flex items-start gap-3">
              <Building className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Municipality</p>
                <p className="text-sm text-muted-foreground">{school.municipality}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* School Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">School Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(school.learners || school.educators) && (
            <div className="grid grid-cols-2 gap-4">
              {school.learners && (
                <div className="flex flex-col items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Users className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-2" />
                  <p className="text-2xl font-bold">{school.learners.toLocaleString('en-US')}</p>
                  <p className="text-sm text-muted-foreground">Learners</p>
                </div>
              )}
              {school.educators && (
                <div className="flex flex-col items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <GraduationCap className="h-8 w-8 text-green-600 dark:text-green-400 mb-2" />
                  <p className="text-2xl font-bold">{school.educators}</p>
                  <p className="text-sm text-muted-foreground">Educators</p>
                </div>
              )}
            </div>
          )}

          {school.learners && school.educators && school.educators > 0 && (
            <div className="flex items-center justify-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Learner-to-Educator Ratio</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {Math.round(school.learners / school.educators)}:1
                </p>
              </div>
            </div>
          )}

          {school.registrationDate && (
            <div className="flex items-start gap-3 pt-2">
              <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Registration Date</p>
                <p className="text-sm text-muted-foreground">
                  {school.registrationDate}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
