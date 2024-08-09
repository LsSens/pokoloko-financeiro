import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// third-party
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

// project imports
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// chart data
import baseChartData, { arredondarParaCima, processarDadosAno } from './chart-data/total-growth-bar-chart';
import { useSelector } from 'react-redux';
import { formatCurrency } from 'utils/formatCurrency';

// ==============================|| DASHBOARD DEFAULT - TOTAL GROWTH BAR CHART ||============================== //

const TotalGrowthBarChart = ({ isLoading }) => {
    const theme = useTheme();
    const allData = useSelector((state) => state.data.allData);
    const targetYear = useSelector((state) => state.data.targetYear);

    const { primary } = theme.palette.text;
    const divider = theme.palette.divider;
    const grey500 = theme.palette.grey[500];

    const primary200 = theme.palette.primary[200];
    const primaryDark = theme.palette.primary.dark;
    const secondaryMain = theme.palette.secondary[800];
    const secondaryLight = theme.palette.secondary.light;

    const [value, setValue] = useState(targetYear);
    const uniqueYears = [...new Set(allData.map((item) => item.ano))];
    const status = uniqueYears.map((year) => ({
        value: year,
        label: year.toString()
    }));

    const [chartData, setChartData] = useState(baseChartData);

    useEffect(() => {
        if (targetYear !== null) setValue(targetYear);
    }, [targetYear]);

    useEffect(() => {
        const { categories, series, maxValue } = processarDadosAno(allData, value);

        const maxYValue = arredondarParaCima(maxValue);

        const newChartData = {
            ...baseChartData,
            options: {
                ...baseChartData.options,
                chart: {
                    ...baseChartData.options.chart,
                    stacked: false
                },
                xaxis: {
                    ...baseChartData.options.xaxis,
                    categories,
                    labels: {
                        rotate: -45,
                        style: {
                            fontSize: '12px',
                            colors: [primary]
                        }
                    }
                },
                yaxis: {
                    min: 0,
                    max: maxYValue,
                    labels: {
                        style: {
                            colors: [primary]
                        },
                        formatter: (value) => `R$ ${formatCurrency(Math.abs(value))}`
                    }
                },
                tooltip: {
                    y: {
                        formatter: (value) => `R$ ${formatCurrency(value)}`
                    },
                    theme: 'light'
                },
                colors: [primary200, primaryDark, secondaryMain, secondaryLight],
                labels: {
                    style: {
                        colors: new Array(12).fill(primary)
                    }
                },
                grid: { borderColor: divider },
                legend: { labels: { colors: grey500 } }
            },
            series
        };

        setChartData(newChartData);

        if (!isLoading) {
            ApexCharts.exec(`bar-chart`, 'updateOptions', newChartData);
        }
    }, [value, primary200, primaryDark, secondaryMain, secondaryLight, primary, divider, isLoading, grey500, allData]);

    return (
        <>
            {isLoading ? (
                <SkeletonTotalGrowthBarChart />
            ) : (
                <MainCard>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12}>
                            <Grid container alignItems="center" justifyContent="space-between">
                                <Grid item>
                                    <Grid container direction="column" spacing={1}>
                                        <Grid item>
                                            <Typography variant="subtitle2">Faturamento total ano {value}</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="h3">
                                                R${' '}
                                                {formatCurrency(
                                                    allData
                                                        .filter((item) => item.ano === value)
                                                        .map((item) => parseFloat(item.soma_valores))
                                                        .reduce((acc, curr) => acc + curr, 0)
                                                )}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <TextField
                                        id="standard-select-currency"
                                        select
                                        value={value}
                                        onChange={(e) => setValue(e.target.value)}
                                    >
                                        {status.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sx={{
                                overflowX: 'auto',
                                overflowY: 'hidden',
                                '& .apexcharts-menu.apexcharts-menu-open': {
                                    bgcolor: 'background.paper'
                                }
                            }}
                        >
                            <Grid
                                sx={{
                                    '@media (max-width: 768px)': {
                                        minWidth: '1200px'
                                    }
                                }}
                            >
                                <Chart
                                    options={chartData.options}
                                    series={chartData.series}
                                    type={chartData.type}
                                    height={chartData.height}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </MainCard>
            )}
        </>
    );
};

TotalGrowthBarChart.propTypes = {
    isLoading: PropTypes.bool
};

export default TotalGrowthBarChart;
