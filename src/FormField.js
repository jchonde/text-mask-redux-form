import React, {PureComponent} from "react";
import {Field} from "redux-form";


/**
 * @description Wrapper pour la composante Field de redux-form,
 * permet d'ajouter des validations sur les champs
 * @class FormField
 * @extends {React.PureComponent<any, any>}
 */
class FormField extends PureComponent {

    validators = () => {
        const validates = [];
        if (this.props.validators) {
            this.props.validators.map((validator) => {
                validates.push(validator.validate);
            });
        }
        return validates;
    }

    render() {
        return (
            <Field warn={this.validators()} {...this.props} />
        );
    }
}

export {FormField};
