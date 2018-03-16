import React, {PureComponent} from "react";

import MaskedInput from "./reactTextMask";

import {WrappedFieldInputProps, WrappedFieldMetaProps} from "redux-form";

const TYPES = {
    accountNumber: {
        mask: [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, "-", /\d/],
        placeholder: "########-###-#",
        guide: true,
        pipe: undefined
    },
    creditCardNumber: {
        mask: [/\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/],
        placeholder: "____-____-____-____",
        guide: true,
        pipe: undefined
    },
    creditCardLast4Digits: {
        mask: [/\d/, /\d/, /\d/, /\d/],
        placeholder: "####",
        guide: true,
        pipe: undefined
    },
    bankAccountNumber: {
        mask: [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/],
        placeholder: "###########",
        guide: true,
        pipe: undefined
    },
    bankTransitNumber: {
        mask: [/\d/, /\d/, /\d/, /\d/, /\d/],
        placeholder: "#####",
        guide: false,
        pipe: undefined
    },
    financialInstitutionNumber: {
        mask: [/\d/, /\d/, /\d/],
        placeholder: "",
        guide: false,
        pipe: undefined
    },
    civicNumber: {
        mask: [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/],
        placeholder: "",
        guide: false,
        pipe: undefined
    },
    creditCardSecurityNumber: {
        mask: [/\d/, /\d/, /\d/],
        placeholder: "",
        guide: true,
        pipe: undefined
    },
    phone: {
        mask: [/[1-9]/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/],
        placeholder: "###-###-####",
        guide: true,
        pipe: undefined
    },
    postalCode: {
        mask: [/[A-Za-z]/i, /\d/, /[A-Za-z]/i, /\d/, /[A-Za-z]/i, /\d/],
        placeholder: "L#L#L#",
        guide: true,
        pipe: upperCasePipe
    },
    simCardNumber: {
        mask: [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/],
        placeholder: "#############",
        guide: true,
        pipe: undefined
    },
    siteId: {
        mask: [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/],
        placeholder: "#######-###",
        guide: true,
        pipe: undefined
    },
    phoneExtension: {
        mask: [/\d/, /\d/, /\d/, /\d/],
        placeholder: "####",
        guide: true,
        pipe: undefined
    },
    singleDigit: {
        mask: [/\d/],
        placeholder: "",
        guide: false,
        pipe: undefined
    },
    monerisConfirmationNumber: {
        mask: [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/],
        placeholder: "##################",
        guide: true,
        pipe: undefined
    },
    noteId: {
        mask: [/\d/, /\d/, /\d/, /\d/, /\d/],
        placeholder: "#####",
        guide: false,
        pipe: undefined
    },
    equipmentNip: {
        mask: [/\d/, /\d/, /\d/, /\d/],
        placeholder: "####",
        guide: true,
        pipe: undefined
    },
};

function hasMask(props) {
    return Boolean(props.mask);
}

function hasFormat(props) {
    return Boolean(props.typeInput);
}

function upperCasePipe(conformedValue) {
    return conformedValue.toUpperCase();
}

/**
 * Stateless Component Input
 * @description Component that renders a form input containing a FormControl or a MaskedInput
 * component depending on if the mask (or format) property is present in the props
 * @class Input
 */
class Input extends PureComponent {

    getMask(props) {
        let mask = {};
        if (hasMask(props)) {
            mask = {mask: props.mask};
        } else if (hasFormat(props)) {
            mask = {
                mask: TYPES[props.typeInput].mask,
                placeholder: TYPES[props.typeInput].placeholder,
                pipe: TYPES[props.typeInput].pipe,
                guide: TYPES[props.typeInput].guide
            };
        }
        return mask;
    }

    /**
     * Déplacer la sélection au dernier caractère alphanumérique, pour ne pas tomber sur les "_"
     * Si la sélection est avant le dernier caractère, la garder
     */
    maskedInputOnSelect = (event) => {
        const index = this.getLastCharacterIndex(event.currentTarget.value) + 1;
        if (index >= 0 && index < event.currentTarget.selectionStart)
            event.currentTarget.setSelectionRange(index, index);
    }

    /**
     * Retourne le dernier caractère alphanumérique d'un string
     */
    getLastCharacterIndex = (value) => {
        let lastIndex = -1;
        for (let i = 0; i < value.length; i += 1) {
            const chr = value.charAt(i);
            if (/^[a-zA-Z\d]+$/.test(chr) && i > lastIndex) {
                lastIndex = i;
            }
        }
        return lastIndex;
    }

    handleKeyDown = (event) => {
        if (this.props.buttonOnClick && event.key === "Enter" && event.shiftKey === false) {
            event.preventDefault(); // Let's stop this event.
            event.stopPropagation(); // Really this time.
            this.props.buttonOnClick();
        }
    };

    renderInput(input, placeholder, props) {
        const mask = {
            placeholder,
            ...this.getMask(props)
        };
        const {typeInput, ...subProps} = props;
        if (mask.mask) {
            console.log(input)
            return (
                <MaskedInput
                    mask={mask.mask}
                    {...input}
                    {...subProps}
                    placeholder={mask.placeholder}
                    pipe={mask.pipe}
                    className="form-control"
                    onSelect={this.maskedInputOnSelect}
                    guide={mask.guide}
                    onKeyDown={this.props.inputPostIcon && this.handleKeyDown}
                />
            );
        } else {
            return (
                <div>
                    ELSE
                </div>
            );
        }
    }

    render() {
        const {
            className,
            required = false,
            labelKey,
            footLabelKey,
            placeholder = "",
            input = {},
            meta = {active: false, touched: false, submitFailed: false, warning: ""},
            locale,
            dispatch,
            validators,
            message,
            postIcon,
            inputPostIcon,
            buttonOnClick,
            ...props
        } = this.props;

        // pipe={TYPES.accountNumber.pipe}
        // guide={TYPES.accountNumber.guide}
        // mask={TYPES.accountNumber.mask}
        // placeholder={TYPES.accountNumber.placeholder}

        return (
            <div>

                <MaskedInput
                    {...input}

                    pipe={TYPES.accountNumber.pipe}
                    guide={TYPES.accountNumber.guide}
                    mask={[/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, "-", /\d/]}
                    placeholder={TYPES.accountNumber.placeholder}

                    // mask={["(", /[1-9]/, /\d/, /\d/, ")", " ", /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/]}
                    // placeholder="(###) ####-####"

                />
            </div>
        );
    }
}

export {Input};
