import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import _ from 'lodash';

@ValidatorConstraint()
export class IsValidEmail implements ValidatorConstraintInterface {
  validate(email: any, validationArguments: ValidationArguments) {
    let checkEmailRex = value => {
      return /^[_A-Za-z0-9-+]+(.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(.[A-Za-z0-9]+)*(.[A-Za-z]{2,})$/i.test(
        value,
      );
    };
    if (_.isArray(email)) {
      let checkedEmailList = email
        .map(value => {
          return checkEmailRex(value);
        })
        .includes(false);
      return checkedEmailList ? false : true;
    } else {
      return checkEmailRex(email);
    }
  }
}
