import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { IconX } from '@tabler/icons-react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useDispatch, useSelector } from 'react-redux';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from '@mui/material';
import { putRequest } from 'api/apiService';
import MainCard from 'ui-component/cards/MainCard';
import { formatMonth } from 'utils/formatMonths';
import SubCard from 'ui-component/cards/SubCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { formatCurrency, parseMonetaryValue } from 'utils/formatCurrency';

// ===============================|| COLOR BOX ||=============================== //

const ColorBox = ({ bgcolor, title, data, dark }) => (
    <>
        <Card sx={{ mb: 3 }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    py: 4.5,
                    bgcolor,
                    color: dark ? 'grey.800' : '#ffffff'
                }}
            >
                {title ? (
                    <Typography variant="subtitle1" color="inherit">
                        {title}
                    </Typography>
                ) : (
                    <Box sx={{ p: 1.15 }} />
                )}
            </Box>
        </Card>
        {data && (
            <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                    <Typography variant="subtitle2">{data.label}</Typography>
                </Grid>
                <Grid item>
                    <Typography variant="subtitle1" sx={{ textTransform: 'uppercase' }}>
                        {data.color}
                    </Typography>
                </Grid>
            </Grid>
        )}
    </>
);

ColorBox.propTypes = {
    bgcolor: PropTypes.string.isRequired,
    title: PropTypes.string,
    data: PropTypes.shape({
        label: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired
    }).isRequired,
    dark: PropTypes.bool
};

// ===============================|| UI COLOR ||=============================== //

const columns = [
    { id: 'date', label: 'Data', minWidth: 170 },
    { id: 'value', label: 'Total', minWidth: 170 },
    { id: 'remove', label: 'Excluir', minWidth: 50 }
];

function createData(day, value, ano, mes) {
    const formattedDay = String(day).padStart(2, '0');
    const formattedMonth = String(mes).padStart(2, '0');
    const date = `${formattedDay}/${formattedMonth}/${ano}`;
    const formattedValue = value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    return { date, value: formattedValue };
}

export default function Financial() {
    const dispatch = useDispatch();
    const selectData = useSelector((state) => state.data.selectData);
    const allData = useSelector((state) => state.data.allData);
    const [isLoading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [open, setOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const [selectedDay, setSelectedDay] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState(selectData.ano);

    const [value, setValue] = useState('0');
    const [total, setTotal] = useState('0');

    const years = Array.from(new Set(allData.map((item) => item.ano)));
    const getAvailableMonths = (year) => {
        return allData
            .filter((item) => item.ano === year)
            .map((item) => item.mes)
            .sort((a, b) => a - b);
    };
    const availableMonths = selectedYear ? getAvailableMonths(selectedYear) : [];

    const handleDayChange = (event) => {
        setSelectedDay(event.target.value);
        const dayValue = selectData.valores_diarios.find((item) => item.day === event.target.value)?.value || 0;
        setValue(formatCurrency(dayValue));
    };

    const handleYearChange = (event) => {
        const year = event.target.value;
        setSelectedYear(year);
        setSelectedMonth('');
        setTotal('0');
    };

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
        const totalValue = allData.find((item) => item.ano === selectedYear && item.mes === event.target.value)?.soma_valores || 0;
        setTotal(formatCurrency(totalValue));
    };

    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: 200
            }
        }
    };

    const rows = selectData.valores_diarios
        .filter((item) => item.value > 0)
        .map((item) => createData(item.day, item.value, selectData.ano, selectData.mes));

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleOpenModal = (item) => {
        setItemToDelete(item);
        setOpen(true);
    };

    const handleCloseModal = () => {
        setOpen(false);
        setItemToDelete(null);
    };

    const handleConfirmDelete = () => {
        if (itemToDelete) {
            const fechamentoId = allData.find((data) => data.ano === selectData.ano && data.mes === selectData.mes)?.id;
            let day = itemToDelete.date.split('/')[0];
            day = day.startsWith('0') ? day.slice(1) : day;
            try {
                setLoading(true);
                putRequest(`${import.meta.env.VITE_API_BASE_URL}/fechamentos/${fechamentoId}/dia/${day}`, { value: 0 }, dispatch);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
                handleCloseModal();
            }
        }
    };

    const handleChangeTotal = (event) => {
        let inputValue = event.target.value;

        let numericValue = inputValue.replace(/\D/g, '');

        if (numericValue.length > 0) {
            numericValue = (Number(numericValue) / 100).toFixed(2).replace('.', ',');
            numericValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        }

        setTotal(numericValue);
    };

    const handleChange = (event) => {
        let inputValue = event.target.value;

        let numericValue = inputValue.replace(/\D/g, '');

        if (numericValue.length > 0) {
            numericValue = (Number(numericValue) / 100).toFixed(2).replace('.', ',');
            numericValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        }

        setValue(numericValue);
    };

    async function changeFatu(e) {
        setLoading(true);
        e.preventDefault();
        try {
            const dayValue = selectData.valores_diarios.find((item) => item.day === selectedDay)?.value || 0;
            const valueFloat = parseMonetaryValue(value);

            if (valueFloat === dayValue) {
                return;
            }
            const fechamentoId = allData.find((data) => data.ano === selectData.ano && data.mes === selectData.mes)?.id;
            putRequest(
                `${import.meta.env.VITE_API_BASE_URL}/fechamentos/${fechamentoId}/dia/${selectedDay}`,
                { value: valueFloat },
                dispatch
            );
            setSelectedDay('');
            setValue('0');
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    async function changeAllFatu(e) {
        e.preventDefault();
        return;
        // setLoading(true);
        // try {
        //     const fechamentoId = allData.find((data) => data.ano === selectedYear && data.mes === selectedMonth)?.id;
        //     const totalValue = allData.find((item) => item.ano === selectedYear && item.mes === selectedMonth)?.soma_valores || 0;
        //     const totalValueFloat = parseMonetaryValue(total).toString();

        //     if (totalValueFloat === totalValue) {
        //         return;
        //     }
        //     putRequest(`${import.meta.env.VITE_API_BASE_URL}/fechamentos/${fechamentoId}/total`, { value: totalValueFloat }, dispatch);
        //     setSelectedDay('');
        //     setValue('0');
        // } catch (e) {
        //     console.error(e);
        // } finally {
        //     setLoading(false);
        // }
    }

    if (isLoading) return <SkeletonPopularCard />;

    return (
        <Grid display={'flex'} flexDirection={'column'} gap={2}>
            <MainCard title="Fechamentos">
                <Grid item container spacing={2} justifyContent={'space-between'}>
                    <Grid item maxWidth={'500px'}>
                        <SubCard>
                            <form onSubmit={changeFatu}>
                                <Grid container spacing={1} alignItems="center" gap={2}>
                                    <Typography sx={{ width: '100%', textAlign: 'center' }}>
                                        Alterar fechamento do mês de {formatMonth(selectData.mes)}
                                    </Typography>
                                    <FormControl sx={{ width: '45%' }} variant="outlined">
                                        <InputLabel id="day-select-label">Dia</InputLabel>
                                        <Select
                                            labelId="day-select-label"
                                            id="day-select"
                                            value={selectedDay}
                                            onChange={handleDayChange}
                                            label="Dia"
                                            MenuProps={MenuProps}
                                        >
                                            {selectData.valores_diarios.map((day, index) => (
                                                <MenuItem key={index} value={day.day}>
                                                    {day.day.toString().startsWith('0') ? day.day.slice(1) : day.day}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl sx={{ width: '45%' }} variant="outlined">
                                        <Grid item xs>
                                            <TextField
                                                id="value"
                                                name="value"
                                                label="Valor"
                                                value={`R$ ${value}`}
                                                onChange={handleChange}
                                                placeholder="R$ 0,00"
                                                type="text"
                                                fullWidth
                                            />
                                        </Grid>
                                    </FormControl>
                                    <FormControl sx={{ width: '100%' }} variant="outlined">
                                        <Grid item>
                                            <Button type="submmit" variant="contained" color="secondary">
                                                Alterar
                                            </Button>
                                        </Grid>
                                    </FormControl>
                                </Grid>
                            </form>
                        </SubCard>
                    </Grid>
                    <Grid item maxWidth={'500px'}>
                        <SubCard>
                            <form onSubmit={changeAllFatu}>
                                <Grid container spacing={1} alignItems="end" gap={2} justifyContent={'end'} maxWidth={'500px'}>
                                    <Typography sx={{ width: '100%', textAlign: 'center' }}>Alterar/Adicionar faturamento total</Typography>
                                    <FormControl sx={{ width: '45%' }} variant="outlined">
                                        <InputLabel id="year-select-label">Ano</InputLabel>
                                        <Select
                                            labelId="year-select-label"
                                            id="year-select"
                                            value={selectedYear}
                                            onChange={handleYearChange}
                                            label="Ano"
                                            disabled
                                        >
                                            {years.map((year) => (
                                                <MenuItem key={year} value={year}>
                                                    {year}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl sx={{ width: '45%' }} variant="outlined">
                                        <InputLabel id="month-select-label">Mês</InputLabel>
                                        <Select
                                            labelId="month-select-label"
                                            id="month-select"
                                            value={selectedMonth}
                                            onChange={handleMonthChange}
                                            label="Mês"
                                            disabled
                                        >
                                            {availableMonths.map((month) => (
                                                <MenuItem key={month} value={month}>
                                                    {formatMonth(month)}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl sx={{ width: '94%' }} variant="outlined">
                                        <Grid item display={'flex'} alignItems={'center'} width={'100%'} gap={5}>
                                            <TextField
                                                id="total"
                                                name="total"
                                                label="Valor"
                                                value={`R$ ${total}`}
                                                onChange={handleChangeTotal}
                                                placeholder="R$ 0,00"
                                                type="text"
                                                fullWidth
                                                disabled
                                            />
                                            <Button type="submmit" variant="contained" color="secondary" disabled>
                                                Alterar
                                            </Button>
                                        </Grid>
                                    </FormControl>
                                </Grid>
                            </form>
                        </SubCard>
                    </Grid>
                </Grid>
            </MainCard>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 600 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.date}>
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {column.id === 'remove' ? (
                                                        <IconX
                                                            style={{ cursor: 'pointer' }}
                                                            stroke={2}
                                                            onClick={() => handleOpenModal(row)}
                                                        />
                                                    ) : (
                                                        value
                                                    )}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
                <Dialog
                    open={open}
                    onClose={handleCloseModal}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{'Excluir faturamento'}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">Tem certeza que deseja continuar?</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModal} color="primary">
                            Cancelar
                        </Button>
                        <Button onClick={handleConfirmDelete} color="secondary" autoFocus>
                            Excluir
                        </Button>
                    </DialogActions>
                </Dialog>
            </Paper>
        </Grid>
    );
}
