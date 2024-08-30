import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';
import { Button, Divider, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { putRequest } from 'api/apiService';
import { useDispatch, useSelector } from 'react-redux';
import { InputWithMask } from 'utils/inputWithMask';
import { formatCurrency } from 'utils/formatCurrency';
import { formatMonth } from 'utils/formatMonths';

const Settings = () => {
    const dispatch = useDispatch();

    const user = useSelector((state) => state.data.user);
    const allData = useSelector((state) => state.data.allData);
    const selectData = useSelector((state) => state.data.selectData);
    const targetYear = useSelector((state) => state.data.targetYear);
    const targetMonth = useSelector((state) => state.data.targetMonth);

    const [workedDays, setWorkedDays] = useState(selectData.dias_trabalhados);
    const [maxGoal, setMaxGoal] = useState(selectData.meta_maxima);
    const [minGoal, setMinGoal] = useState(selectData.meta_minima);
    const [selectedYear, setSelectedYear] = useState(targetYear);
    const [selectedMonth, setSelectedMonth] = useState(targetMonth);
    const [isLoading, setLoading] = useState(false);

    const years = Array.from(new Set(allData.map((item) => item.ano)));
    const getAvailableMonths = (year) => {
        return allData
            .filter((item) => item.ano === year)
            .map((item) => item.mes)
            .sort((a, b) => a - b);
    };
    const availableMonths = selectedYear ? getAvailableMonths(selectedYear) : [];

    const handleYearChange = (event) => {
        const year = event.target.value;
        setSelectedYear(year);
        setSelectedMonth('');
    };

    const handleMonthChange = (event) => {
        const newMonth = event.target.value;
        if (newMonth !== selectedMonth) {
            setLoading(true);
            setSelectedMonth(newMonth);
            putRequest(`${import.meta.env.VITE_API_BASE_URL}/selecionado`, { ano: selectedYear, mes: newMonth }, dispatch).finally(() => {
                const dataItem = allData.find((item) => item.ano === selectedYear && item.mes === newMonth);
                setMaxGoal(dataItem.meta_maxima);
                setMinGoal(dataItem.meta_minima);
                setWorkedDays(dataItem.dias_trabalhados);
                setLoading(false);
            });
        }
    };

    async function changeDays(e) {
        e.preventDefault();

        const totalDays = selectData.valores_diarios[selectData.valores_diarios.length - 1].day;
        if (workedDays > totalDays) {
            return notyf('Esse dia não é valido');
        }
        if (workedDays && !isNaN(workedDays) && workedDays != selectData.dias_trabalhados) {
            setLoading(true);
            const url = `${import.meta.env.VITE_API_BASE_URL}/fechamentos/${selectData.id}/dias-trabalhados`;
            await putRequest(url, { dias_trabalhados: workedDays }, dispatch).finally(() => {
                setLoading(false);
            });
        }
    }

    async function changeMaxGoal(e) {
        e.preventDefault();
        let value = maxGoal;

        if (isNaN(value)) {
            value = parseFloat(value.replace('R$', '').replace('.', '').replace(',', '.').trim());
        }
        if (parseFloat(value) !== parseFloat(selectData.meta_maxima)) {
            setLoading(true);
            const url = `${import.meta.env.VITE_API_BASE_URL}/fechamentos/${selectData.id}/meta`;
            await putRequest(url, { meta_maxima: value, meta_minima: parseFloat(minGoal) }, dispatch).finally(() => {
                setMaxGoal(value);
                setLoading(false);
            });
        }
    }

    async function changeMinGoal(e) {
        e.preventDefault();
        let value = minGoal;

        if (isNaN(value)) {
            value = parseFloat(value.replace('R$', '').replace('.', '').replace(',', '.').trim());
        }
        if (parseFloat(value) !== parseFloat(selectData.meta_minima)) {
            setLoading(true);
            const url = `${import.meta.env.VITE_API_BASE_URL}/fechamentos/${selectData.id}/meta`;
            await putRequest(url, { meta_minima: value, meta_maxima: parseFloat(maxGoal) }, dispatch).finally(() => {
                setMinGoal(value);
                setLoading(false);
            });
        }
    }

    return (
        <>
            {isLoading ? (
                <SkeletonEarningCard />
            ) : (
                <MainCard title="Configurações">
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12} sm={6}>
                            <SubCard title="Perfil">
                                <Grid container direction="column" spacing={1} gap={4}>
                                    <form>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <TextField id="nome" label="Nome" variant="outlined" value={user.nome} fullWidth disabled />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    id="email"
                                                    label="E-mail"
                                                    variant="outlined"
                                                    value={user.email}
                                                    fullWidth
                                                    disabled
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Button variant="contained" color="secondary" disabled>
                                                    Alterar
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </form>
                                    <Divider />
                                    <form>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    id="current-password"
                                                    disabled
                                                    type="password"
                                                    label="Senha Atual"
                                                    variant="outlined"
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    id="new-password"
                                                    disabled
                                                    type="password"
                                                    label="Nova senha"
                                                    variant="outlined"
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Button disabled variant="contained" color="secondary">
                                                    Alterar senha
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </form>
                                </Grid>
                            </SubCard>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <SubCard title="Métricas">
                                <Grid container spacing={2} direction="column">
                                    <Grid item container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <SubCard>
                                                <Grid display={'flex'} justifyContent={'space-between'}>
                                                    <FormControl sx={{ width: '40%' }} variant="outlined">
                                                        <InputLabel id="year-select-label">Ano</InputLabel>
                                                        <Select
                                                            labelId="year-select-label"
                                                            id="year-select"
                                                            value={selectedYear}
                                                            onChange={handleYearChange}
                                                            label="Ano"
                                                        >
                                                            {years.map((year) => (
                                                                <MenuItem key={year} value={year}>
                                                                    {year}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                    <FormControl sx={{ width: '40%' }} variant="outlined" disabled={!selectedYear}>
                                                        <InputLabel id="month-select-label">Mês</InputLabel>
                                                        <Select
                                                            labelId="month-select-label"
                                                            id="month-select"
                                                            value={selectedMonth}
                                                            onChange={handleMonthChange}
                                                            label="Mês"
                                                        >
                                                            {availableMonths.map((month) => (
                                                                <MenuItem key={month} value={month}>
                                                                    {formatMonth(month)}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                            </SubCard>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <SubCard>
                                                <form onSubmit={changeDays}>
                                                    <Grid container spacing={2} alignItems="center">
                                                        <Grid item xs>
                                                            <TextField
                                                                id="worked-days"
                                                                type="number"
                                                                label="Dias de trabalho"
                                                                variant="outlined"
                                                                value={workedDays}
                                                                onChange={(e) => setWorkedDays(e.target.value)}
                                                                fullWidth
                                                            />
                                                        </Grid>
                                                        <Grid item>
                                                            <Button type="submit" variant="contained" color="secondary">
                                                                Alterar
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </form>
                                            </SubCard>
                                        </Grid>
                                    </Grid>
                                    <Grid item container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <SubCard>
                                                <form onSubmit={changeMinGoal}>
                                                    <Grid container spacing={2} alignItems="center">
                                                        <Grid item xs>
                                                            <InputWithMask
                                                                id="minGoals"
                                                                name="minGoals"
                                                                maskType="money"
                                                                label="Meta minima"
                                                                value={`R$ ${formatCurrency(minGoal)}`}
                                                                setValue={setMinGoal}
                                                                placeholder="R$ 0,00"
                                                                type="text"
                                                            />
                                                        </Grid>
                                                        <Grid item>
                                                            <Button type="submit" variant="contained" color="secondary">
                                                                Alterar
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </form>
                                            </SubCard>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <SubCard>
                                                <form onSubmit={changeMaxGoal}>
                                                    <Grid container spacing={2} alignItems="center">
                                                        <Grid item xs>
                                                            <InputWithMask
                                                                id="maxGoals"
                                                                name="maxGoals"
                                                                maskType="money"
                                                                label="Meta máxima"
                                                                value={`R$ ${formatCurrency(maxGoal)}`}
                                                                setValue={setMaxGoal}
                                                                placeholder="R$ 0,00"
                                                                type="text"
                                                            />
                                                        </Grid>
                                                        <Grid item>
                                                            <Button type="submit" variant="contained" color="secondary">
                                                                Alterar
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </form>
                                            </SubCard>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </SubCard>
                        </Grid>
                    </Grid>
                </MainCard>
            )}
        </>
    );
};

export default Settings;
