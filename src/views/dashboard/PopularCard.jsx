import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from 'store/constant';

// assets
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Paper from '@mui/material/Paper';
import { useSelector } from 'react-redux';
import { formatCurrency } from 'utils/formatCurrency';
import { formatMonth } from 'utils/formatMonths';
import { useNavigate } from 'react-router-dom';

// ==============================|| DASHBOARD DEFAULT - POPULAR CARD ||============================== //
function calcDaysWorked(selectDate) {
    let daysWorked = 0;

    if (selectDate && typeof selectDate.valores_diarios !== 'undefined') {
        let valoresDiarios;
        if (typeof selectDate.valores_diarios === 'string') {
            try {
                valoresDiarios = JSON.parse(selectDate.valores_diarios);
            } catch (error) {
                console.error('Erro ao fazer parse de valores_diarios:', error);
                return daysWorked;
            }
        } else {
            valoresDiarios = selectDate.valores_diarios;
        }

        valoresDiarios.forEach((day) => {
            if (day.value !== 0) {
                daysWorked++;
            }
        });
    }

    return daysWorked;
}

function calcMetrics(selectData, goal) {
    let daily = 0;
    let exceeded = 0;
    let missing = 0;

    if (!selectData || !goal) {
        return { daily, exceeded, missing };
    }

    const goalValue = goal === 'max' ? selectData.meta_maxima : selectData.meta_minima;
    const daysWorkedSoFar = calcDaysWorked(selectData);
    const totalDays = selectData.dias_trabalhados;

    if (goalValue && totalDays > daysWorkedSoFar) {
        missing = goalValue - selectData.soma_valores;
        daily = missing / (totalDays - daysWorkedSoFar);
        daily = daily > 0 ? formatCurrency(daily) : 0;
        exceeded = missing < 0 ? formatCurrency(-missing) : 0;
        missing = missing > 0 ? formatCurrency(missing) : 0;
    }

    return { daily, exceeded, missing };
}

const PopularCard = ({ isLoading }) => {
    const selectData = useSelector((state) => state.data.selectData);
    const minMetrics = calcMetrics(selectData, 'min');
    const maxMetrics = calcMetrics(selectData, 'max');
    const navigate = useNavigate();

    if (isLoading) return <SkeletonPopularCard />;

    return (
        <MainCard content={false}>
            <CardContent>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <Grid container alignContent="center" justifyContent="space-between">
                            <Grid item>
                                <Typography variant="h4">
                                    Métricas {formatMonth(selectData.mes)} de {selectData.ano}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <TableContainer component={Paper}>
                            <Table sx={{ maxWidth: '100%' }} aria-label="caption table">
                                <TableHead>
                                    <TableCell colSpan={3}>
                                        <Typography variant="h5" ml={1}>
                                            Meta maxima
                                        </Typography>
                                    </TableCell>
                                    <TableRow>
                                        <TableCell>Diaria</TableCell>
                                        <TableCell align="center">Faltante</TableCell>
                                        <TableCell align="right">Exedente</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>R$ {maxMetrics.daily}</TableCell>
                                        <TableCell align="center">R$ {maxMetrics.missing}</TableCell>
                                        <TableCell align="right">R$ {maxMetrics.exceeded}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid item xs={12}>
                        <TableContainer component={Paper}>
                            <Table sx={{ maxWidth: '100%' }} aria-label="caption table">
                                <TableHead>
                                    <TableCell colSpan={3}>
                                        <Typography variant="h5" ml={1}>
                                            Meta minima
                                        </Typography>
                                    </TableCell>
                                    <TableRow>
                                        <TableCell>Diaria</TableCell>
                                        <TableCell align="center">Faltante</TableCell>
                                        <TableCell align="right">Exedente</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>R$ {minMetrics.daily}</TableCell>
                                        <TableCell align="center">R$ {minMetrics.missing}</TableCell>
                                        <TableCell align="right">R$ {minMetrics.exceeded}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </CardContent>
            <CardActions sx={{ p: 1.25, pt: 0, justifyContent: 'center' }}>
                <Button size="small" onClick={() => navigate('/fechamentos')} disableElevation>
                    Fechamentos
                    <ChevronRightOutlinedIcon />
                </Button>
            </CardActions>
        </MainCard>
    );
};

PopularCard.propTypes = {
    isLoading: PropTypes.bool
};

export default PopularCard;
