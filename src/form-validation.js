import * as flat from "flat";
import * as validator from "validator";

import { TNoteListItemEditProps } from "component/note-list-item-edit";

import { INoteFormValues } from "model/note";
import { DateService } from "service/date";

import { PRIVILEGE_NOTE, PrivilegeService } from "../privilege";

const lodash = require("lodash");

/**
 * @deprecated cette methode ne DOIT JAMAIS ÊTRE utilisé
 *
 * Story pour deleter les erreurs introduit par ce genre d'erreur
 * https://jira.int.videotron.com/browse/TPRCP-12905
 *
 * Story concernant un besion client conernant les forma d'affichage
 * https://jira.int.videotron.com/browse/TPRCP-12515
 *
 * Note: Cette meme erreur est utilisée aussi dans src\container\credit-premiere-offense\action.ts
 */
const numberForWire = (number: string) => {
  return Number(number.replace(",", ".")).toString();
};

export const reduxFormValidate = (arrayOfValidation: ValidatorForm[]) => (formValue: any): object => {
  const errorList = {};
  for (let i = 0; i < arrayOfValidation.length; i = i + 1) {
    const error = arrayOfValidation[i].validateForm(formValue);
    if (error != undefined) {
      Object.assign(errorList, error);
    }
  }
  return errorList;
};

export const findError = (errorObject: any) => {
  const errorMessages = [];
  const flatObject = flat.flatten(errorObject);
  const keys = Object.keys(flatObject);
  for (let i = 0; i < keys.length; i = i + 1) {
    const error = flatObject[keys[i]];
    if (error != undefined) {
      errorMessages.push(error);
    }
  }

  return errorMessages;
};

/**
 * @param errorCode: string - code d'erreur pour Intl
 * @abstract
 * @class Validator
 */
export abstract class Validator {
  constructor(public errorCode: string) {
  }
  public abstract validate: (value: string) => string | undefined;
}

/**
 * @param min: number - nombre minimal de caractères d'un champ
 * @param max: number - nombre maximal de caractères d'un champ
 * @abstract
 * @class LengthXtoYOptional
 * @extends {Validator}
 */
export abstract class LengthXtoYOptional extends Validator {
  constructor(public min: number, public max: number) {
    super("isLength");
  }
  validate = (value: string): string | undefined => {
    if (!value) {
      return undefined;
    }
    return validator.isLength(value, { min: this.min, max: this.max }) ? undefined : this.errorCode;
  }
}

/**
 * @param num: number - nombre de caractères requis d'un champ
 * @abstract
 * @class LengthEqualtoXOptional
 * @extends {Validator}
 */
export abstract class LengthEqualtoXOptional extends Validator {
  constructor(public num: number) {
    super("isEqual");
  }
  validate = (value: string): string | undefined => {
    if (!value) {
      return undefined;
    }
    return validator.isLength(value, { min: this.num, max: this.num }) ? undefined : this.errorCode;
  }
}

/**
 * @param min: number - nombre de caractères minimum requis d'un champ
 * @abstract
 * @class LengthUpToX
 * @extends {Validator}
 */
export abstract class LengthUpToX extends Validator {
  constructor(public min: number) {
    super("isUpperEqual");
  }
  validate = (value: string): string | undefined => {
    if (!value) {
      return this.errorCode;
    }
    return validator.isLength(value, { min: this.min }) ? undefined : this.errorCode;
  };
}


/**
 * Permet de vérifier que le champ contient au moins 1 caractère numéric
 * @class ContainNumber
 * @extends {Validator}
 */
export class ContainNumber extends Validator {
  constructor() {
    super("isContainNumber");
  }
  validate = (value: string): string | undefined => {
    if (!value) {
      return undefined;
    } else {
      const regExp = /\d/;
      return (regExp).test(value) ? undefined : this.errorCode;
    }
  }
}

/**
 * Permet de vérifier que le champ contient au maximum 3 caracteres speciaux
 * @class UpToXSpecialChars
 * @extends {Validator}
 */
abstract class UpToXSpecialChars extends Validator {
  constructor(public specialCharsMaxCount: number) {
    super("upToXSpecialChars");
  }
  validate = (value: string): string | undefined => {
    if (!value) {
      return undefined;
    } else {
      return (value.replace(/\w/g, "").length <= this.specialCharsMaxCount) ? undefined : this.errorCode;
    }
  }
}

/**
 * Permet de ne pas autoriser plus de 3 caractères speciaux sur un champ
 */
export class UpTo3SpecialChars extends UpToXSpecialChars {
  constructor() {
    super(3);
  }
}


/**
 * @param num1, num2: number - nombres de caractères num1 ou num2 requis d'un champ
 * @abstract
 * @class LengthEqualXorYOptional
 * @extends {Validator}
 */
export abstract class LengthEqualXorYOptional extends Validator {
  constructor(public num1: number, public num2: number) {
    super("isEqualTwoNum");
  }
  validate = (value: string): string | undefined => {
    let isEqualNum1 = false;
    let isEqualNum2 = false;
    if (!value) {
      return undefined;
    }
    isEqualNum1 = validator.isLength(value, { min: this.num1, max: this.num1 });
    isEqualNum2 = validator.isLength(value, { min: this.num2, max: this.num2 });
    return (isEqualNum1 || isEqualNum2) ? undefined : this.errorCode;
  };
}

/**
 * Permet de mettre une grandeur minimum de 1 et un maximum de 3 caractères sur un champ
 */
export class Length1to3 extends LengthXtoYOptional {
  constructor() {
    super(1, 3);
  }
}

/**
 * Permet de mettre une grandeur minimum de 1 et un maximum de 5 caractères sur un champ
 */
export class Length1to5 extends LengthXtoYOptional {
  constructor() {
    super(1, 5);
  }
}

/**
 * Permet de mettre une grandeur minimum de 1 et un maximum de 7 caractères sur un champ
 */
export class Length1to7 extends LengthXtoYOptional {
  constructor() {
    super(1, 7);
  }
}

/**
 * Permet de mettre une grandeur minimum de 2 et un maximum de 15 caractères sur un champ
 */
export class Length2to15 extends LengthXtoYOptional {
  constructor() {
    super(2, 15);
  }
}

/**
 * Permet de mettre une grandeur minimum de 1 et un maximum de 18 caractères sur un champ
 */
export class Length1to18 extends LengthXtoYOptional {
  constructor() {
    super(1, 18);
  }
}

/**
 * Permet de mettre une grandeur minimum de 1 et un maximum de 19 caractères sur un champ
 */
export class Length1to19 extends LengthXtoYOptional {
  constructor() {
    super(1, 19);
  }
}

/**
 * Permet de mettre une grandeur minimum de 2 et un maximum de 20 caractères sur un champ
 */
export class Length2to20 extends LengthXtoYOptional {
  constructor() {
    super(2, 20);
  }
}


/**
 * Permet de mettre une grandeur minimum de 1 et un maximum de 30 caractères sur un champ
 */
export class Length1to30 extends LengthXtoYOptional {
  constructor() {
    super(1, 30);
  }
}

/**
 * Permet de mettre une grandeur minimum de 2 et un maximum de 30 caractères sur un champ
 */
export class Length2to30 extends LengthXtoYOptional {
  constructor() {
    super(2, 30);
  }
}

/**
 * Permet de mettre une grandeur minimum de 1 et un maximum de 50 caractères sur un champ
 */
export class Length1to50 extends LengthXtoYOptional {
  constructor() {
    super(1, 50);
  }
}

/**
 * Permet de mettre une grandeur minimum de 8 caractères sur un champ
 */
export class LengthUpTo8 extends LengthUpToX {
  constructor() {
    super(8);
  }
}

/**
 * Permet de mettre une grandeur minimum de 6 caractères sur un champ
 */
export class LengthUpTo6 extends LengthUpToX {
  constructor() {
    super(6);
  }
}

/**
 * Permet de mettre une grandeur minimum de 4 caractères sur un champ
 */
export class LengthUpTo4 extends LengthUpToX {
  constructor() {
    super(4);
  }
}

/**
 * Permet de mettre une grandeur minimum de 3 caractères sur un champ
 */
export class LengthUpTo3 extends LengthUpToX {
  constructor() {
    super(3);
  }
}

/**
 * Permet une grandeur stricte de 10 caractères sur un champ
 */
export class LengthEqualTo10 extends LengthEqualtoXOptional {
  constructor() {
    super(10);
  }
}

/**
 * Permet une grandeur stricte de 8 ou 12 caractères sur un champ
 */
export class LengthEqual8or12 extends LengthEqualXorYOptional {
  constructor() {
    super(8, 12);
  }
}

/**
 * @param min: number - nombre de caractères minimum requis d'un champ sans le champ wildcard à la fin
 */
abstract class LengthUpToXWithoutWildcard extends Validator {
  constructor(public min: number) {
    super("isUpperEqual");
  }
  validate = (value: string): string | undefined => {
    if (!value) {
      return undefined;
    }
    value = value.replace(/(\%|\*)$/, "");
    return validator.isLength(value, { min: this.min }) ? undefined : this.errorCode;
  };
}

export class IsValidCreditCardNumber extends Validator {
  constructor() {
    super("isValidCreditCardNumber");
  }

  validate = (number: string): string | undefined => {
    return validator.isCreditCard(number) ? undefined : this.errorCode;
  }

}

/**
 * Permet de mettre une grandeur minimum de 3 caractères sur un champ sans le champ wildcard à la fin
 */
export class LengthUpTo3WithoutWildcard extends LengthUpToXWithoutWildcard {
  constructor() {
    super(3);
  }
}


/**
 * Permet la validation la position d'un caractere wildcard a la fin
 */
export class WildcardAllowed extends Validator {
  constructor() {
    super("WildcardAllowed");
  }

  validate = (value: string): string | undefined => {
    if (!value) {
      return undefined;
    }

    return value.match(/^([a-zA-ZàáâäæçéèêëîïôœùûüÿÀÂÄÆÇÉÈÊËÎÏÔŒÙÛÜŸ \-\']+)?(\%?|\*?)$/) ? undefined : this.errorCode;
  };
}

/**
 * Permet de vérifier si la valeur est numérique
 */
export class IsNumberOptional extends Validator {
  constructor() {
    super("isNumber");
  }

  validate = (value: string): string | undefined => {
    if (!value) {
      return undefined;
    }
    const regExp = /^[-]?([0-9]+)(?:(\,|.)\d+)?$/;
    return regExp.test(value) ? undefined : this.errorCode;
  }
}

export class IsValidFormatPhoneNumber extends Validator {
  constructor() {
    super("isValidFormatPhoneNumber");
  }

  validate = (value: string): string | undefined => {
    if (!value) {
      return undefined;
    }
    const regExp = /[2-9][0-9][0-9][2-9][0-9][0-9][0-9][0-9][0-9][0-9]/;
    return regExp.test(value) ? undefined : this.errorCode;
  }
}


export class IsValidFormatLettersNumbersSpacesAndDashes extends Validator {
  constructor() {
    super("isValidFormatLettersNumbersSpacesAndDashes");
  }

  validate = (value: string): string | undefined => {
    if (!value) {
      return undefined;
    }
    const regExp = /^[a-zA-Z0-9\ \-]*$/;
    return regExp.test(value) ? undefined : this.errorCode;
  }
}

export class IsValidFormatPostalCode extends Validator {
  constructor() {
    super("isValidFormatPostalCode");
  }

  validate = (value: string): string | undefined => {
    if (!value) {
      return undefined;
    }
    const regExp = /[A-Za-z][0-9][A-Za-z][0-9][A-Za-z][0-9]/;
    return regExp.test(value) ? undefined : this.errorCode;
  }
}

/**
 * Permet de mettre une valeur minimum et un maximum dans un champ. De la valeur minimum incluse à la valeur maximum incluse.
 * @param min: number - valeur minimal du champ
 * @param max: number - valeur maximal du champ
 */
export class AmountXtoYOptional extends Validator {
  constructor(public min: number, public max: number) {
    super("isAmountInRange");
  }
  validate = (value: string): string | undefined => {
    if (!value) {
      return undefined;
    }
    return this.validateAmountInRange(value, this.min, this.max) ? undefined : this.errorCode;
  }

  validateAmountInRange = (value: string, min: number, max: number): any => {
    if (Number(numberForWire(value)) > max) {
      return;
    }
    else if (Number(numberForWire(value)) < min) {
      return;
    }
    else {
      return true;
    }
  }
}

export class IsValueIn extends Validator {
  private min: number;
  private max: number;

  constructor(min: number, max: number) {
    super("isValueIn");
    this.min = min;
    this.max = max;
  }
  validate = (value: string): string | undefined => {
    return this.isValueIn(Number(value)) ? undefined : this.errorCode;
  }

  isValueIn = (value: number): any => {
    return value <= Number(this.max) && value >= Number(this.min);
  }
}

export class IsValueInRange extends Validator {
  public min: string;
  public max: string;

  constructor(min: string, max: string) {
    super("isValueInRange");

    this.min = numberForWire(min);
    this.max = numberForWire(max);
  }
  validate = (value: string): string | undefined => {
    if (!isNaN(parseFloat(value))) {
      return this.isValueInRange(value, this.min, this.max) ? undefined : this.errorCode;
    } else {
      return this.errorCode;
    }
  }

  isValueInRange = (value: string, min: string, max: string): any => {
    return (Number(numberForWire(value)) >= Number(numberForWire(min))) &&
      (Number(numberForWire(value)) <= Number(numberForWire(max)));
  }
}

export class IsValueSuperior extends Validator {
  public min: string;

  constructor(min: string) {
    super("IsValueSuperior");
    this.min = numberForWire(min);
  }
  validate = (value: string): string | undefined => {
    return this.IsValueSuperior(value, this.min) ? undefined : this.errorCode;
  }

  IsValueSuperior = (value: string, min: string): any => {
    return (Number(numberForWire(value)) >= Number(numberForWire(min)));
  }
}


export class IsValidAccountNumber extends Validator {
  constructor() {
    super("isValidAccountNumber");
  }
  validate = (value: string): string | undefined => {
    const regExp = /^(\d{8})([-]{1})(\d{3})([-]{1})(\d{1})$/;
    return (regExp).test(value) ? undefined : this.errorCode;
  };
}

/**
 * Permet de rendre un champ requis
 */
export class Required extends Validator {
  constructor() {
    super("isRequired");
  }
  validate = (value: string): string | undefined => {
    return value ? undefined : this.errorCode;
  }
}


/**
 * Permet de valider une date
 */
export class ValidDate extends Validator {
  private locale: string;

  constructor(locale: string) {
    super("isValidDate");
    this.locale = locale;
  }
  validate = (value: string): string | undefined => {
    if (value !== undefined && value.length > 0) {
      return value !== undefined && value.length >= 10 && DateService.isValid(value, this.locale) ? undefined : this.errorCode;
    } else {
      return undefined;
    }
  }
}


/**
 * Permet de rendre un champ de type checkbox list requis
 */
export class RequiredCheckboxList extends Validator {
  constructor() {
    super("isRequiredCheckboxList");
  }

  validateItem = (item: any) => {
    return item.isChecked && item.isChecked != false ? undefined : "notChecked";
  }

  validate = (values: any): any => {
    let errors: any = {};
    errors = values.map(this.validateItem);
    errors._error = this.errorCode;
    for (let i = 0; i < errors.length; i = i + 1) {
      if (errors[i] != "notChecked") {
        errors = undefined;
        break;
      }
    }
    return errors;
  }
}


/**
 * Permet de tester que la date est supérieure à la date du jour
 */
export class LaterDate extends Validator {
  constructor() {
    super("isLaterDate");
  }
  validate = (value: string): string | undefined => {
    return value && !validator.isAfter(value) ? this.errorCode : undefined;
  }
}

/**
 * Permet de tester que la date est supérieure à une autre date
 */
export class LaterDateThanOtherDate extends Validator {
  private dateFrom: string;
  constructor(value: string) {
    super("isLaterDateThanOtherDate");
    this.dateFrom = value;
  }
  validate = (value: string): string | undefined => {
    return value && !validator.isAfter(value, this.dateFrom) ? this.errorCode : undefined;
  }
}

export abstract class ValidatorForm extends Validator {

  public abstract validateForm: (formValue: any) => any | undefined;

  protected getValue = (formValue: any, pathFieldName: string): string => {
    const flatObject = flat.flatten(formValue);
    return flatObject[pathFieldName];
  };

  protected setValue = (object: any, pathFieldName: string, value: string): any => {

    object = {
      ...object,
      [pathFieldName]: value

    };
    const unflatObject = flat.unflatten(object);
    return unflatObject;
  }
}

/**
 * Permet de faire qu'une seule section du formulaire soit remplit.
 */
export class OnlyOneSection extends ValidatorForm {
  constructor() {
    super("isOnlyOneSection");
  }

  validate = (allValue: any): any => {
    let isOnlyOneSection = true;
    let isFormValid = true;
    lodash.forOwn(allValue, (sectionForm: any) => {
      const isSectionValid = this.validateSection(sectionForm);
      if (!isFormValid && !isSectionValid) {
        isOnlyOneSection = false;
      } else if (!isSectionValid) {
        isFormValid = false;
      }
    });
    return isOnlyOneSection;
  }

  validateForm = (allValue: any) => {
    if (this.validate(allValue)) {
      return undefined;
    } else {
      return this.failure(allValue);
    }

  }

  validateSection = (sectionForm: any) => {
    let isSectionValid = true;
    if (lodash.isObjectLike(sectionForm)) {
      lodash.forOwn(sectionForm, () => {
        if (!lodash.isEmpty(sectionForm)) {
          isSectionValid = false;
        }
      });
    }
    return isSectionValid;
  }

  failure = (allValue: any) => {
    const deep = lodash.cloneDeep(allValue);
    lodash.forOwn(deep, (sectionForm: any) => {
      lodash.forOwn(sectionForm, (input: any, sectionFormInput: string) => {
        input;
        sectionForm[sectionFormInput] = this.errorCode;
      });
    });
    return deep;
  }
}


// Add 2 validations for credit card forms
export class IsValidCreditCard extends ValidatorForm {
  constructor() {
    super("isNumberCompatibleWithType");
  }

  validateForm = (allValue: any) => {
    const number = this.getValue(allValue, "number");
    const type = this.getValue(allValue, "type");


    if (!type || !number) {
      return undefined;
    }

    if ((type == "VISA" && number[0] != "4") || (type == "MC" && number[0] != "5" && number[0] != "2")) {
      return this.failure(["number"]);
    }
    if (type == "MC" && number[0] == "2") {
      // Si ca commence par 2, les 6 premiers chiffres doivent être compris entre 222100 et 272099 inclusivement.
      const val = Number(number.substring(0, 6));
      if (222100 > val || val > 272099) {
        return this.failure(["number"]);
      }
    }

    return undefined;
  }
  validate = (): string | undefined => {
    return undefined;
  }
  failure = (fieldName: string[]) => {
    return fieldName.reduce((previousValue: any, currentValue: string) => {
      return this.setValue(previousValue, currentValue, this.errorCode);
    }, undefined);
  }

}

export class IsValidMonerisConfirmationNumber extends Validator {
  constructor() {
    super("isValidMonerisConfirmationNumber");
  }

  validate = (monerisConfirmationNumber: string): string | undefined => {
    const monerisConfirmationNumberNoMask = monerisConfirmationNumber.replace(/_/g, "");
    return monerisConfirmationNumberNoMask.length < 18 ? this.errorCode : undefined;
  }

}

export class IsValidRestrictionTypeSelection extends ValidatorForm {
  constructor() {
    super("isValidRestrictionTypeSelection");
  }

  validateForm = (allValue: any) => {
    if (this.getValue(allValue, "authorizationType") === "S" && lodash.find(allValue.productFamiliesOptions, (option: any): boolean => option.isChecked === true) === undefined) {
      return this.failure(["productFamiliesOptions"]);
    }

    return undefined;
  }
  validate = (): string | undefined => {
    return undefined;
  }
  failure = (fieldName: string[]) => {
    return fieldName.reduce((previousValue: any, currentValue: string) => {
      return this.setValue(previousValue, currentValue, this.errorCode);
    }, undefined);
  }
}

export class IsValidEmailAlias extends Validator {
  constructor() {
    super("isValidEmailAlias");
  }

  validate = (emailAlias: string): string | undefined => {
    /*
     On test si l'alias de l'email teste correspond a cette regex :
     Il ne faut pas que le premier caractere soit n'importe quel espace ou ( ) > < @  , ; : \ " . [ ]
     de plus s'il y a un " il ne faut pas qu'il y en ai un autre qui suit
     ainsi que s'il y a un point il ne faut pas que ces derniers caracteres soient apres le point
     il est possible qu' un point soit zero ou plusieurs fois present dans l'alias tant que ca respecte la regle precedente
    */
    const regExp = /^([^\s\(\)><@,;:\\\"\.\[\]]+|("[^"]*"))(\.([^\s\(\)><@,;:\\\"\.\[\]]+|("[^"]*")))*$/;
    return (regExp).test(emailAlias) ? undefined : this.errorCode;
  }
}

export class IsValidEmailDomain extends Validator {
  constructor() {
    super("isValidEmailDomain");
  }

  validate = (emailDomain: string): string | undefined => {
    const regExp = /(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])/;
    return (regExp).test(emailDomain) ? undefined : this.errorCode;
  }
}

export class IsValidExpirationDate extends ValidatorForm {
  constructor(private locale: string) {
    super("isValidExpirationDate");
  }

  validateForm = (allValue: any) => {
    const expirationDateMonth = this.getValue(allValue, "expirationDateMonth");
    const expirationDateYear = this.getValue(allValue, "expirationDateYear");
    if (!expirationDateMonth || !expirationDateYear) {
      return undefined;
    }
    const expirationDateMonthValue = Number(expirationDateMonth);
    const expirationDateYearValue = Number(expirationDateYear);
    const currentMonth = DateService.getCurrentMonth(this.locale);
    const currentYear = DateService.getCurrentYear(this.locale);

    if (currentYear > expirationDateYearValue) {
      return this.failure(["expirationDateYear"]);
    } else if (currentYear == expirationDateYearValue && currentMonth > expirationDateMonthValue) {
      return this.failure(["expirationDateMonth"]);
    }
    return undefined;
  }
  validate = (): string | undefined => {
    return undefined;
  }
  failure = (fieldName: string[]) => {
    return fieldName.reduce((previousValue: any, currentValue: string) => {
      return this.setValue(previousValue, currentValue, this.errorCode);
    }, undefined);
  }
}


/**
 * Normalize an account number to match backend and validators expected format
 */
export const normalizeAccountNumber = (value: string) => (
  value.replace(/\D/g, "")
);

/**
 * Normalize a site ID (# potentiel) to match backend and validators expected format
 */
export const normalizeSiteId = (value: string) => (
  value.replace(/\D/g, "")
);

/**
 * Normalize a phone number to match backend and validators expected format
 */
export const normalizePhoneNumber = (value: string) => (
  value.replace(/\D/g, "")
);


/**
 * Specific form validator for notes
 */
export class IsValidateNoteForm extends ValidatorForm {
  constructor(private props: TNoteListItemEditProps) {
    super("isValidateNoteForm");
  }

  validateForm = (values: INoteFormValues) => {
    const errors: { [key: string]: string } = {};
    const userHasPrivilegesToCreateThisNote: boolean = PrivilegeService.hasPrivilegeNote(this.props.privilegeList, values.noteId, PRIVILEGE_NOTE.HAS_ALLOW_CREATE_NOTE);

    if (!lodash.isEmpty(values.noteId) && !userHasPrivilegesToCreateThisNote) {
      errors["noteId"] = "noteIdChangeIsNotAllowed";
    }
    if (!lodash.isEmpty(values.reminderDate) && !lodash.isEmpty(values.expiryDate)) {
      errors["expiryDate"] = "onlyOneDateCanBeSet";
    }
    return errors;
  }

  validate = (): string | undefined => {
    return undefined;
  }

  failure = (fieldName: string[]) => {
    return fieldName.reduce((previousValue: any, currentValue: string) => {
      return this.setValue(previousValue, currentValue, this.errorCode);
    }, undefined);
  }
}
