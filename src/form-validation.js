import * as validator from "validator";

/**
 * @param errorCode: string - code d'erreur pour Intl
 * @abstract
 * @class Validator
 */
export class Validator {
    constructor(errorCode) {
    }
}


/**
 * @param num1, num2: number - nombres de caractères num1 ou num2 requis d'un champ
 * @abstract
 * @class LengthEqualXorYOptional
 * @extends {Validator}
 */
export class LengthEqualXorYOptional extends Validator {
    constructor(num1, num2) {
        super("isEqualTwoNum");
    }

    validate = (value) => {
        let isEqualNum1 = false;
        let isEqualNum2 = false;
        if (!value) {
            return undefined;
        }
        isEqualNum1 = validator.isLength(value, {min: this.num1, max: this.num1});
        isEqualNum2 = validator.isLength(value, {min: this.num2, max: this.num2});
        return (isEqualNum1 || isEqualNum2) ? undefined : this.errorCode;
    };
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
 * Normalize an account number to match backend and validators expected format
 */
export const normalizeAccountNumber = (value) => (
    value.replace(/\D/g, "")
);
