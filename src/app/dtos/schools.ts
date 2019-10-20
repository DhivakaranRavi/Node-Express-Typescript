import { IsNotEmpty, IsArray, IsString, Validate } from 'class-validator';
import { IsValidEmail } from '../utils';

export class CreateStudentDTO {
  @Validate(IsValidEmail, {
    message: 'please enter a vaild email address for teacher',
  })
  @IsNotEmpty()
  public teacher: string;

  @Validate(IsValidEmail, {
    message: 'please enter a vaild email address for students',
  })
  @IsArray()
  public students: string[];
}

export class CommonStudentDTO {
  @Validate(IsValidEmail, {
    message: 'please enter a vaild email address for teacher',
  })
  @IsNotEmpty()
  teacher: string | Array<string>;
}

export class StudentSuspendDTO {
  @Validate(IsValidEmail, {
    message: 'please enter a vaild email address for student',
  })
  @IsNotEmpty()
  public student: string;
}

export class SendNotificationDTO {
  @Validate(IsValidEmail, {
    message: 'please enter a vaild email address for teacher',
  })
  @IsNotEmpty()
  public teacher: string;

  @IsString()
  public notification: string;
}
