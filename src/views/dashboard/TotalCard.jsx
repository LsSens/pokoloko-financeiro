/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

// assets
import EarningIcon from 'assets/images/icons/earning.svg';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useSelector } from 'react-redux';
import { formatCurrency } from 'utils/formatCurrency';
import { formatMonth } from 'utils/formatMonths';

// ===========================|| DASHBOARD DEFAULT - EARNING CARD ||=========================== //

const TotalCard = ({ isLoading }) => {
    const theme = useTheme();
    const allData = useSelector((state) => state.data.allData);
    const selectData = useSelector((state) => state.data.selectData);
    const targetYear = useSelector((state) => state.data.targetYear);
    const targetMonth = useSelector((state) => state.data.targetMonth);

    const currentBilling = allData.find((allData) => allData.ano === targetYear && allData.mes === targetMonth);
    const pastBilling = allData.find((allData) => allData.ano === targetYear && allData.mes === targetMonth - 1);

    if (isLoading) {
        return <SkeletonEarningCard />;
    }

    return (
        <MainCard
            border={false}
            content={false}
            sx={{
                bgcolor: 'secondary.dark',
                color: '#fff',
                overflow: 'hidden',
                position: 'relative',
                '&:after': {
                    content: '""',
                    position: 'absolute',
                    width: 210,
                    height: 210,
                    background: theme.palette.secondary[800],
                    borderRadius: '50%',
                    top: { xs: -105, sm: -85 },
                    right: { xs: -140, sm: -95 }
                },
                '&:before': {
                    content: '""',
                    position: 'absolute',
                    width: 210,
                    height: 210,
                    background: theme.palette.secondary[800],
                    borderRadius: '50%',
                    top: { xs: -155, sm: -125 },
                    right: { xs: -70, sm: -15 },
                    opacity: 0.5
                }
            }}
        >
            <Box sx={{ p: 2.25 }}>
                <Grid container direction="column">
                    <Grid item>
                        <Grid container justifyContent="space-between">
                            <Grid item>
                                <Avatar
                                    variant="rounded"
                                    sx={{
                                        ...theme.typography.commonAvatar,
                                        ...theme.typography.largeAvatar,
                                        bgcolor: 'secondary.800',
                                        mt: 1
                                    }}
                                >
                                    <img src={EarningIcon} alt="Notification" />
                                </Avatar>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid container alignItems="center">
                            <Grid item>
                                <Typography sx={{ fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>
                                    R$ {formatCurrency(selectData.soma_valores)}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Avatar
                                    sx={{
                                        cursor: 'pointer',
                                        ...theme.typography.smallAvatar,
                                        bgcolor: 'secondary.200',
                                        color: 'secondary.dark'
                                    }}
                                >
                                    {pastBilling && currentBilling.soma_valores > pastBilling.soma_valores ? (
                                        <ArrowUpwardIcon fontSize="inherit" sx={{ transform: 'rotate3d(1, 1, 1, 45deg)' }} />
                                    ) : (
                                        <ArrowDownwardIcon fontSize="inherit" sx={{ transform: 'rotate3d(1, 1, 1, 45deg)' }} />
                                    )}
                                </Avatar>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item sx={{ mb: 1.25 }}>
                        <Typography
                            sx={{
                                fontSize: '1rem',
                                fontWeight: 500,
                                color: 'secondary.200'
                            }}
                        >
                            Faturamento de {formatMonth(targetMonth)}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </MainCard>
    );
};

TotalCard.propTypes = {
    isLoading: PropTypes.bool
};

export default TotalCard;
