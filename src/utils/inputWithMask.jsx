/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Box, TextField } from '@mui/material';
import { forwardRef, useState } from 'react';

function InputWithMaskDefault({ name, label, placeholder, maskType, onChange, defaultValue, setValue, ...rest }, ref) {
    const [valueDefault, setValueDefault] = useState(rest ? rest.value : '');

    const cardNumberMask = (number) => {
        return number
            .replace(/\D/g, '')
            .replace(/(\d{4})(\d)/, '$1 $2')
            .replace(/(\d{4})(\d)/, '$1 $2')
            .replace(/(\d{4})(\d)/, '$1 $2');
    };

    const expirationMask = (number) => {
        return number
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '$1/$2')
            .replace(/(\d{4})(\d)/, '$1 $2');
    };

    const moneyMask = (value) => {
        let v = value.replace(/\D/g, '');
        v = (v / 100).toFixed(2) + '';
        v = v.replace('.', ',');
        v = v.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
        return `R$ ${(value = v)}`;
    };

    const cepMask = (number) => {
        return number.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2');
    };

    const phoneMask = (number) => {
        return number.replace(/\D/g, '').replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    };

    const timeMask = (number) => {
        return number.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1:$2');
    };

    const dateMask = (number) => {
        return number
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '$1/$2')
            .replace(/(\d{2})(\d)/, '$1/$2');
    };

    function setMask(e) {
        let value = e;
        if (maskType === 'cardNumber' && e.length <= 19) {
            value = cardNumberMask(e);
        }
        if (maskType === 'expiration' && e.length <= 7) {
            value = expirationMask(e);
        }
        if (maskType === 'money') {
            value = moneyMask(e);
        }
        if (maskType === 'cep' && e.length <= 9) {
            value = cepMask(e);
        }
        if (maskType === 'time' && e.length <= 5) {
            value = timeMask(e);
        }
        if (maskType === 'date' && e.length <= 10) {
            value = dateMask(e);
        }
        if (maskType === 'phone' && e.length <= 15) {
            value = phoneMask(e);
        }
        return value;
    }

    return (
        <Box display="flex" flexDirection="column">
            <TextField
                id={name}
                name={name}
                label={label}
                variant="outlined"
                type="text"
                placeholder={placeholder}
                onChange={(e) => {
                    const maskedValue = setMask(e.target.value);
                    setValueDefault(maskedValue);
                    setValue(maskedValue);
                }}
                value={valueDefault}
                defaultValue={defaultValue}
                ref={ref}
            />
        </Box>
    );
}

export const InputWithMask = forwardRef(InputWithMaskDefault);
