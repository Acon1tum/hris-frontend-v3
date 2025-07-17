export interface GeneralInformation {
  firstName: string;
  middleName: string;
  lastName: string;
  fullName: string;
  birthdate: string;
  contactNumber: string;
  address: string;
  email: string;
  gender: string;
  civilStatus: string;
  citizenship: string;
}

export interface EmploymentDetails {
  employmentType: string;
  designation: string;
  department: string;
  appointmentDate: string;
  startDate: string;
  employmentStatus: string;
  jobLevel: string;
  jobGrade: string;
}

export interface MembershipInformation {
  gsis: string;
  pagibig: string;
  philhealth: string;
  sss: string;
}

export interface OtherInformation {
  dependents: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  emergencyContactRelationship: string;
}

export interface UserProfile {
  general: GeneralInformation;
  employment: EmploymentDetails;
  membership: MembershipInformation;
  other: OtherInformation;
}

export interface MyProfileResponse {
  success: boolean;
  data: UserProfile;
  message: string;
} 