export const processarDadosAno = (data, ano) => {
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

    const metasMinimas = new Array(12).fill(0);
    const metasMaximas = new Array(12).fill(0);
    const valoresAtingidos = new Array(12).fill(0);
    let maxValue = 0;

    data.filter((item) => item.ano === ano).forEach((item) => {
        const index = item.mes - 1;
        metasMinimas[index] = parseFloat(item.meta_minima);
        metasMaximas[index] = parseFloat(item.meta_maxima);
        valoresAtingidos[index] = parseFloat(item.soma_valores);
        maxValue = Math.max(maxValue, metasMaximas[index], valoresAtingidos[index]);
    });

    // Arredondar maxValue para o próximo número significativo
    maxValue = Math.ceil(maxValue / 10000) * 10000;

    return {
        categories: meses,
        series: [
            { name: 'Meta mínima', data: metasMinimas },
            { name: 'Meta máxima', data: metasMaximas },
            { name: 'Faturado', data: valoresAtingidos }
        ],
        maxValue
    };
};

export function arredondarParaCima(valor) {
    const potenciaDe10 = Math.pow(10, Math.floor(Math.log10(valor)));
    return Math.ceil(valor / potenciaDe10) * potenciaDe10;
}

export function formatToK(value) {
    if (value >= 1000) {
        return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toString();
}

// ==============================|| DASHBOARD - TOTAL GROWTH BAR CHART ||============================== //

const baseChartData = {
    height: 480,
    type: 'bar',
    options: {
        chart: {
            id: 'bar-chart',
            stacked: true,
            toolbar: {
                show: true
            },
            zoom: {
                enabled: true
            }
        },
        responsive: [
            {
                breakpoint: 768,
                options: {
                    yaxis: {
                        labels: {
                            style: {
                                fontSize: '10px'
                            },
                            formatter: (value) => `R$ ${formatToK(Math.abs(value))}`
                        }
                    },
                    tooltip: {
                        y: {
                            formatter: (value) => `R$ ${formatToK(value)}`
                        },
                        theme: 'light'
                    },
                    xaxis: {
                        labels: {
                            rotate: -45,
                            style: {
                                fontSize: '10px'
                            }
                        }
                    },
                    chart: {
                        height: 400
                    },
                    legend: {
                        position: 'bottom',
                        fontSize: '12px'
                    }
                }
            }
        ],
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '40%',
                dataLabels: {
                    position: 'top'
                }
            }
        },
        xaxis: {
            type: 'category',
            categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
        },
        legend: {
            show: true,
            fontFamily: `'Roboto', sans-serif`,
            position: 'bottom',
            offsetX: 20,
            labels: {
                useSeriesColors: false
            },
            markers: {
                width: 16,
                height: 16,
                radius: 5
            },
            itemMargin: {
                horizontal: 15,
                vertical: 8
            }
        },
        fill: {
            type: 'solid'
        },
        dataLabels: {
            enabled: false
        },
        grid: {
            show: true
        }
    },
    series: []
};
export default baseChartData;
