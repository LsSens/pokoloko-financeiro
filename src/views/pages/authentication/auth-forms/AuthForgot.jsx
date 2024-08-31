import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useState } from 'react';
import AnimateButton from 'ui-component/extended/AnimateButton';

const AuthRegister = ({ ...others }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [message, setMessage] = useState(null);
    const [inProcess, setInProcess] = useState(false);

    const handlePasswordReset = async (email) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });
            const data = await response.json();

            if (response.ok) {
                setInProcess(true);
                setMessage({ type: 'success', text: data.message });
            } else if (response.status === 404) {
                setMessage({ type: 'error', text: data.error });
            } else {
                setMessage({ type: 'error', text: data.error });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Erro ao processar a solicitação.' });
        }
    };

    const handlePasswordChange = async (values) => {
        console.log(values);
        if (values.password === '' || values.confirmPassword === '' || values.code === '') {
            return setMessage({ type: 'error', text: 'Preencha todos os campos' });
        }
        if (values.code.length <= 5) {
            return setMessage({ type: 'error', text: 'O código deve ter 6 digitos' });
        }
        if (values.password.length <= 7) {
            return setMessage({ type: 'error', text: 'A senha deve ter no minimo 8 caracteres' });
        }
        if (values.password !== values.confirmPassword) {
            return setMessage({ type: 'error', text: 'As senhas não correspondem.' });
        }
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: values.email, newPassword: values.password, code: values.code })
            });
            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: data.message });
                navigate('/login');
            } else if (response.status === 404) {
                setMessage({ type: 'error', text: data.error });
            } else {
                setMessage({ type: 'error', text: data.error });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Erro ao processar a solicitação.' });
        }
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Insira um email válido').max(255).required('Email é obrigatório')
    });

    return (
        <>
            <Grid container direction="column" justifyContent="center" spacing={2}>
                <Grid item xs={12}>
                    <Box sx={{ alignItems: 'center', display: 'flex' }}>
                        <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
                    </Box>
                </Grid>
                <Grid item xs={12} container alignItems="center" justifyContent="center">
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1">Insira o e-mail para recuperação de senha</Typography>
                    </Box>
                </Grid>
            </Grid>

            <Formik
                initialValues={{
                    email: '',
                    code: '',
                    password: '',
                    confirmPassword: '',
                    submit: null
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting, setErrors }) => {
                    setMessage(null);
                    if (inProcess) {
                        handlePasswordChange(values)
                            .catch((error) => {
                                setErrors({ submit: error.message });
                            })
                            .finally(() => {
                                setSubmitting(false);
                            });
                    } else {
                        handlePasswordReset(values.email)
                            .catch((error) => {
                                setErrors({ submit: error.message });
                            })
                            .finally(() => {
                                setSubmitting(false);
                            });
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit} {...others}>
                        <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-email-register">Endereço de e-mail</InputLabel>
                            <OutlinedInput
                                disabled={inProcess}
                                id="outlined-adornment-email-register"
                                type="email"
                                value={values.email}
                                name="email"
                                onBlur={handleBlur}
                                onChange={(e) => {
                                    setMessage(null);
                                    handleChange(e);
                                }}
                                inputProps={{}}
                            />
                            {touched.email && errors.email && (
                                <FormHelperText error id="standard-weight-helper-text--register">
                                    {errors.email}
                                </FormHelperText>
                            )}
                        </FormControl>

                        {inProcess && (
                            <>
                                <FormControl
                                    fullWidth
                                    error={Boolean(touched.code && errors.code)}
                                    sx={{ ...theme.typography.customInput }}
                                >
                                    <InputLabel htmlFor="outlined-adornment-code-register">Código de recuperação</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-code-register"
                                        type="text"
                                        value={values.code}
                                        name="code"
                                        onBlur={handleBlur}
                                        onChange={(e) => {
                                            setMessage(null);
                                            handleChange(e);
                                        }}
                                        inputProps={{ maxLength: 6 }}
                                    />
                                    {touched.code && errors.code && (
                                        <FormHelperText error id="standard-weight-helper-text--register">
                                            {errors.code}
                                        </FormHelperText>
                                    )}
                                </FormControl>

                                <FormControl
                                    fullWidth
                                    error={Boolean(touched.password && errors.password)}
                                    sx={{ ...theme.typography.customInput }}
                                >
                                    <InputLabel htmlFor="outlined-adornment-pass-register">Nova senha</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-pass-register"
                                        type="password"
                                        value={values.password}
                                        name="password"
                                        onBlur={handleBlur}
                                        onChange={(e) => {
                                            setMessage(null);
                                            handleChange(e);
                                        }}
                                        inputProps={{}}
                                    />
                                    {touched.password && errors.password && (
                                        <FormHelperText error id="standard-weight-helper-text--register">
                                            {errors.password}
                                        </FormHelperText>
                                    )}
                                </FormControl>

                                <FormControl
                                    fullWidth
                                    error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                                    sx={{ ...theme.typography.customInput }}
                                >
                                    <InputLabel htmlFor="outlined-adornment-confirmPass-register">Repita a senha</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-confirmPass-register"
                                        type="password"
                                        value={values.confirmPassword}
                                        name="confirmPassword"
                                        onBlur={handleBlur}
                                        onChange={(e) => {
                                            setMessage(null);
                                            handleChange(e);
                                        }}
                                        inputProps={{}}
                                    />
                                    {touched.confirmPassword && errors.confirmPassword && (
                                        <FormHelperText error id="standard-weight-helper-text--register">
                                            {errors.confirmPassword}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </>
                        )}

                        {errors.submit && (
                            <Box sx={{ mt: 3 }}>
                                <FormHelperText error>{errors.submit}</FormHelperText>
                            </Box>
                        )}
                        {message && (
                            <Typography
                                variant="body2"
                                sx={{
                                    color: message.type === 'success' ? 'success.main' : 'error.main'
                                }}
                            >
                                {message.text}
                            </Typography>
                        )}

                        <Box sx={{ mt: 2 }}>
                            <AnimateButton>
                                <Button
                                    disableElevation
                                    disabled={isSubmitting}
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                >
                                    {inProcess ? 'Alterar senha' : 'Recuperar senha'}
                                </Button>
                            </AnimateButton>
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default AuthRegister;
